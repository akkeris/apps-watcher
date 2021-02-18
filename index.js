const k8s = require('@kubernetes/client-node');
const vault = require('node-vault');
const url = require('url');
const http = require('http');
const https = require('https');
const assert = require('assert');
const fs = require('fs');
const axios = require('axios');

const kc = new k8s.KubeConfig();
const { Watch } = require('./watch.js');

const sendQueue = [];
setInterval(() => {
  if (sendQueue.length > 0) {
    const item = sendQueue.shift();
    const connect = item.uri.protocol === 'https:' ? https : http;
    const req = connect.request(item.uri, item.options);
    if (process.env.DEBUG) {
      const { method } = item.options;
      const { protocol, host, pathname } = item.uri;
      const { key, action } = item.payload;
      console.log(`[debug] ${method} ${protocol}//${host}${pathname} ${key} ${action}`);
    }
    req.on('error', (e) => console.log(`${item.uri.protocol}//${item.uri.host}${item.uri.pathname} failed `, e));
    req.write(JSON.stringify(item.payload, null, 2));
    req.end();
  }
}, 100);

function send(payload) {
  (process.env.NOTIFY || '')
    .split(',')
    .filter((x) => x !== ''.trim())
    .map((uri) => new url.URL(uri))
    .forEach((uri) => {
      const headers = { 'content-type': 'application/json' };
      if (uri.username && !uri.password) {
        headers.authorization = uri.username;
        uri.username = '';
      }
      sendQueue.push({
        uri,
        payload,
        options: {
          method: 'POST',
          headers,
        },
      });
    });
}

async function checkPermissions() {
  const accessPods = { spec: { resourceAttributes: { verb: 'watch', resource: 'pods' } } };
  const accessDeployments = { spec: { resourceAttributes: { verb: 'watch', resource: 'deployment', group: 'apps' } } };

  const k8sApi = kc.makeApiClient(k8s.AuthorizationV1Api);

  const canWatchPods = (await k8sApi.createSelfSubjectAccessReview(accessPods)).body.status.allowed;
  const canWatchDeployments = (await k8sApi.createSelfSubjectAccessReview(accessDeployments)).body.status.allowed;

  const errors = [];

  if (!canWatchPods) {
    errors.push('Service account must be able to watch pods at the cluster level.');
  }

  if (!canWatchDeployments) {
    errors.push('Service account must be able to watch deployments at the cluster level.');
  }

  if (errors.length > 0) {
    throw new Error(`Error validating permissions:\n${errors.join('\n')}`);
  }
}

// Preferred mode - use default Kubernetes cluster with service account
async function loadFromCluster() {
  console.log('\nIn-cluster mode: Connecting to default Kubernetes cluster...');
  try {
    kc.loadFromCluster();
    await checkPermissions();
  } catch (err) {
    console.log('\nIn-cluster loading failed with the following message:\n', err.message);
    return false;
  }
  return true;
}

async function loadFromKubeConfig() {
  console.log('Kubeconfig mode: Using ~/.kube/config...');
  try {
    assert.ok(process.env.HOME, 'The HOME environment variable was not found.');
    assert.ok(
      fs.existsSync(`${process.env.HOME}/.kube/config`),
      `The kubeconfig file was not found at ${process.env.HOME}/.kube/config`,
    );
    kc.loadFromFile(`${process.env.HOME}/.kube/config`);
    await checkPermissions();
  } catch (err) {
    console.log('\nKubeconfig loading failed with the following message:\n', err.message);
    return false;
  }
  return true;
}

// Legacy mode - requires oodles of environment variables
async function loadFromVault() {
  console.log('\nVault mode: Using credentials stored in Vault...');
  try {
    assert.ok(process.env.VAULT_ADDR, 'The VAULT_ADDR was not found.');
    assert.ok(process.env.VAULT_TOKEN, 'The VAULT_TOKEN was not found.');
    assert.ok(process.env.KUBERNETES_CONTEXT, 'The KUBERNETES_CONTEXT value was not found.');
    assert.ok(process.env.KUBERNETES_API_SERVER, 'The KUBERNETES_API_SERVER value was not found.');

    if (!process.env.VAULT_ADDR.startsWith('http')) {
      process.env.VAULT_ADDR = `https://${process.env.VAULT_ADDR}`;
    }

    if (!process.env.KUBERNETES_API_SERVER.startsWith('http')) {
      process.env.KUBERNETES_API_SERVER = `https://${process.env.KUBERNETES_API_SERVER}`;
    }

    const vc = vault({ apiVersion: 'v1', endpoint: process.env.VAULT_ADDR, token: process.env.VAULT_TOKEN });

    const token = (await vc.read(process.env.KUBERNETES_TOKEN_SECRET)).data;

    const cluster = {
      name: `akkeris-${process.env.KUBERNETES_CONTEXT}-cluster`,
      server: `${process.env.KUBERNETES_API_SERVER}`,
    };

    const user = {
      name: `akkeris-${process.env.KUBERNETES_CONTEXT}-admin`,
      token: token.token,
    };

    const context = {
      name: process.env.KUBERNETES_CONTEXT,
      cluster: cluster.name,
      user: user.name,
    };

    kc.loadFromOptions({
      clusters: [cluster],
      users: [user],
      contexts: [context],
      currentContext: context.name,
    });

    await checkPermissions();
  } catch (err) {
    console.log('\nVault loading failed with the following message:\n', err.message);
    return false;
  }
  return true;
}

async function connectKube() {
  console.log('Connecting to kubernetes...');

  if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT && (await loadFromCluster())) {
    console.log('Successfully connected to Kubernetes in-cluster!');
  } else if ((await loadFromKubeConfig())) {
    console.log('Successfully connected to Kubernetes via kubeconfig!');
    if (process.env.KUBERNETES_CONTEXT) {
      kc.setCurrentContext(process.env.KUBERNETES_CONTEXT);
    }
  } else if ((await loadFromVault())) {
    console.log('Successfully connected to Kubernetes by reading from Vault!');
    if (process.env.KUBERNETES_CONTEXT) {
      kc.setCurrentContext(process.env.KUBERNETES_CONTEXT);
    }
  } else {
    throw new Error('Failed to connect to Kubernetes - All available connection methods failed.');
  }

  kc.applyToRequest({ forever: true, headers: {} });
}

function done(message, launch, err) {
  if (err) {
    console.error(err);
  }
  console.log(`== rewatching for ${message}`);
  launch();
}

let reportedCrashed = {};

// Clear the crashed cache every 30 minutes
setInterval(() => { reportedCrashed = {}; }, 30 * 60 * 1000);

function exitCodeIndicatesCrash(exitCode) {
  // http://www.gnu.org/software/bash/manual/html_node/Exit-Status.html
  // https://unix.stackexchange.com/questions/110348/how-do-i-get-the-list-of-exit-codes-and-or-return-codes-and-meaning-for-a-comm
  // Exit code        0  = successful
  // Exit code        1  = unsuccessful
  // Exit code      126  = command found, but not executable
  // Exit code      127  = command not found
  // Exit code      128  = invalid exit code passed
  // Exit code      130  = SIGUSR sent
  // Exit code 9 OR 137  = SIGKILL sent
  // Exit code 15 OR 143 = SIGTERM sent
  // Exit code 23 OR 141 = SIGPIPE sent

  if (exitCode !== 0 // Successful exit
      && exitCode !== 126 // Ignore, we catch this other places, its not technically a crash
      && exitCode !== 127 // Ignore, we catch this other places, its not technically a crash
      && exitCode !== 130 // Ignore this, its an explicit stop sent by kubernetes
      && exitCode !== 143 // Ignore this, its the SIGTERM sent by kubernetes
      && exitCode !== 15) { // Ignore this, its the SIGTERM sent without a bash termianl by kubernetes
    return true;
  }
  return false;
}

function reportCrashed(type, obj, appName, spaceName, dyno, dynoType, description, code, restarts) {
  const app = `${appName}-${spaceName}`;
  // Add crash to cache (for duplicate detection)
  reportedCrashed[app + dyno] = obj;

  const payload = {
    app: {
      name: appName,
    },
    space: {
      name: spaceName,
    },
    dynos: [
      { dyno, type: dynoType },
    ],
    key: app,
    action: 'crashed',
    description,
    code,
    restarts,
    crashed_at: (new Date(Date.now())).toISOString(),
  };

  if (process.env.DEBUG) {
    console.log(
      '[debug] app crashed:', JSON.stringify(payload, null, 2),
      'type', JSON.stringify(type, null, 2),
      'obj', JSON.stringify(obj, null, 2),
    );
  }

  if (process.env.TEST_MODE) {
    return payload;
  }
  console.log(`** ${app} crashed ${code} (${description})\n`);
  send(payload);
  return null;
}

function crashed(type, obj) {
  // Make sure the event has the correct structure (ignores other types of events)
  if (!obj.metadata || !obj.metadata.labels || !obj.metadata.name || !obj.status) {
    return null;
  }

  // Parse app name from metadata
  let appName;
  if (obj.metadata.labels['akkeris.io/app-name']) {
    appName = obj.metadata.labels['akkeris.io/app-name'];
  } else {
    // Ignore event if app name label does not exist
    return null;
  }

  // Parse space, dyno information from metadata
  let dynoType;
  if (obj.metadata.labels['akkeris.io/dyno-type']) {
    dynoType = obj.metadata.labels['akkeris.io/dyno-type'];
  } else {
    dynoType = obj.metadata.name.indexOf('--') === -1
      ? 'web' : obj.metadata.name.substring(obj.metadata.name.indexOf('--') + 2);
  }

  const spaceName = obj.metadata.namespace;
  const app = `${appName}-${spaceName}`;
  const dyno = obj.metadata.name.replace(`${obj.metadata.name}-`, '');

  // Detect whether or not this event indicates a crash

  // K8S can't schedule pod
  const scheduled = obj.status.phase === 'Pending'
    && obj.status.conditions
    && obj.status.conditions.filter((x) => (
      x.reason === 'Unschedulable' && x.message && x.type === 'PodScheduled' && x.status === 'False'
    )).length > 0;

  if (scheduled) {
    return reportCrashed(type, obj, appName, spaceName, dyno, dynoType, 'Platform limit error', 'H98', 0);
  }

  // No K8S pod scheduling errors.

  // All the next crashed indicators need obj.status.containerStatuses so if this isn't present, we're done
  if (!obj.status.containerStatuses) {
    return null;
  }

  const { containerStatuses } = obj.status;

  // Out Of Memory
  const oom = containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'OOMKilled');

  // App Crashed
  const appCrashed = containerStatuses.filter((x) => (x.state.terminated
      && x.state.terminated.reason === 'Error'
      && x.state.terminated.exitCode !== 137
      && exitCodeIndicatesCrash(x.state.terminated.exitCode))
      || (x.state.waiting
      && x.state.waiting.reason === 'CrashLoopBackOff'
      && x.lastState
      && x.lastState.terminated
      && exitCodeIndicatesCrash(x.lastState.terminated.exitCode)));

  // App still creating
  const creating = appCrashed.length === 0 && containerStatuses.filter((x) => (
    x.state.waiting && x.state.waiting.reason === 'ContainerCreating'
  ));

  // Ignore duplicate crashed events
  if (reportedCrashed[app + dyno] && creating.length === 0) {
    return null;
  }

  // App never started
  const command = containerStatuses.filter((x) => (x.state.terminated
    && x.state.terminated.reason === 'ContainerCannotRun')
    || (x.state.waiting
    && x.state.waiting.reason === 'CrashLoopBackOff'
    && x.lastState.terminated
    && x.lastState.terminated.reason === 'ContainerCannotRun'));

  // App exited prematurely
  const premature = !obj.metadata.deletionTimestamp ? containerStatuses.filter((x) => (
    x.state.terminated && x.state.terminated.reason === 'Completed'
  )) : [];

  // Error pulling image
  const image = appCrashed.length === 0 && containerStatuses.filter((x) => (
    x.state.waiting && (x.state.waiting.reason === 'ImagePullBackOff' || x.state.waiting.reason === 'ErrImagePull')
  ));

  // App hasn't started up in time
  const readiness = (appCrashed.length === 0 && obj.status.phase === 'Running')
    ? containerStatuses.filter((x) => (
      x.state.running
        && x.state.running.startedAt
        && (((new Date(x.state.running.startedAt)).getTime() + (60 * 1000)) < Date.now())
        && x.ready === false
        && dynoType === 'web'
    )) : [];

  // Unused crash indicators
  // const reasons = containerStatuses.map((x) => (x.state.terminated ? x.state.terminated.reason : '')).join(',');
  // const restarting = !!(readiness.length > 0 && creating.length > 0);

  // Nothing in event that would indicate a crash.
  if (
    oom.length === 0
    && appCrashed.length === 0
    && command.length === 0
    && premature.length === 0
    && readiness.length === 0
    && image.length === 0
    && !scheduled
  ) {
    return null;
  }

  // Parse number of restarts
  let restarts = containerStatuses ? containerStatuses.map((x) => x.restartCount || 0).reduce((a, b) => a + b, []) : 0;
  if (typeof restarts === 'string') {
    restarts = parseInt(restarts, 10);
  }

  // Set description of crash in order of priority
  let description = 'Unknown error';
  let code = 'H0';
  if (oom.length > 0) {
    description = 'Memory quota exceeded';
    code = 'R14';
  } else if (appCrashed.length > 0) {
    description = 'App crashed';
    code = 'H10';
  } else if (command.length > 0) {
    description = 'App did not startup';
    code = 'H9';
  } else if (readiness.length > 0) {
    description = 'App boot timeout';
    code = 'H20';
  } else if (premature.length > 0) {
    description = 'App exited prematurely';
    code = 'H8';
  } else if (image.length > 0) {
    description = 'Platform error';
    code = 'H99';
  }

  return reportCrashed(type, obj, appName, spaceName, dyno, dynoType, description, code, restarts);
}

function crashedWatch() {
  (new Watch(kc)).watch('/api/v1/pods', {}, crashed, done.bind(null, 'crashes', crashedWatch));
}

const lastRelease = {};
function released(type, obj) {
  // App objects will have the release-uuid in the metadata
  if (!(obj.metadata && obj.metadata.labels && Object.keys(obj.metadata.labels).includes('akkeris.io/release-uuid'))) {
    return null;
  }

  if (process.env.DEBUG) {
    console.log('[debug] received released candidate', type, JSON.stringify(obj, null, 2));
  }

  const appName = obj.metadata.labels['akkeris.io/app-name'];
  const spaceName = obj.metadata.namespace;
  const dynoType = obj.metadata.labels['akkeris.io/dyno-type'];
  const app = `${appName}-${spaceName}`;
  const { image } = obj.spec.template.spec.containers[0];
  const releaseUUID = obj.metadata.labels['akkeris.io/release-uuid'];

  // Ignore objects that don't indicate that a release is completed
  if (
    // Only look at new releases
    lastRelease[app] === releaseUUID
    // Deployment must be fully available
    || !(obj.status && obj.status.conditions)
    || obj.status.conditions.filter((x) => x.type === 'Available' && x.status === 'True').length === 0
    || obj.status.observedGeneration !== obj.metadata.generation
    // All replicas must be ready and running the latest image
    || obj.status.availableReplicas !== obj.status.readyReplicas
    || obj.status.readyReplicas !== obj.status.replicas
    || obj.status.replicas !== obj.status.updatedReplicas
  ) {
    if (process.env.DEBUG) {
      console.log('[debug] candidate did not meet requirements.');
    }
    return null;
  }

  lastRelease[app] = releaseUUID;

  const payload = {
    app: {
      name: appName,
    },
    space: {
      name: spaceName,
    },
    dyno: {
      type: dynoType,
    },
    release: {
      id: releaseUUID,
    },
    key: app,
    action: 'released',
    slug: {
      image,
    },
    released_at: new Date().toISOString(),
  };

  if (process.env.DEBUG) {
    console.log('[debug] app released:', JSON.stringify(payload, null, 2));
  }

  if (process.env.TEST_MODE) {
    return payload;
  }

  console.log(`** ${app} released ${image}`);
  send(payload);
  return null;
}

function releasedWatch() {
  const path = '/apis/apps/v1/deployments';
  (new Watch(kc)).watchNew(path, { includeUninitialized: false }, released, done.bind(null, 'releases', releasedWatch));
}

// Get all Akkeris release UUIDs currently deployed in the cluster and store them.
// This will greatly decrease the chance of duplicate deployment events.
async function cacheDeploymentReleaseUUIDs() {
  // Get metadata for all deployments in all namespaces with the release-uuid label present
  const requestOptions = {
    url: `${kc.getCurrentCluster().server}/apis/apps/v1/deployments`, // Get all deployments
    headers: {
      Accept: 'application/json;as=Table;v=v1beta1;g=meta.k8s.io', // Only get metadata for each deployment
    },
    params: {
      labelSelector: 'akkeris.io/release-uuid', // Only get deployments with the release-uuid label
    },
  };

  kc.applyToRequest(requestOptions); // Adds k8s authorization header to the request object

  try {
    const { data: { rows } } = await axios.request(requestOptions);
    rows.forEach(({ object: { metadata } }) => {
      lastRelease[`${metadata.labels['akkeris.io/app-name']}-${metadata.namespace}`] = metadata.labels['akkeris.io/release-uuid'];
    });
    console.log('Successfully cached existing release UUIDs!');
  } catch (err) {
    console.log('Unable to cache existing release UUIDs:');
    console.log(err);
  }
}

if (!process.env.TEST_MODE) {
  (async function watch() {
    try {
      await connectKube();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    await cacheDeploymentReleaseUUIDs();

    releasedWatch();
    crashedWatch();
  }()).catch((e) => console.error(e));
}

module.exports = {
  released,
  crashed,
};
