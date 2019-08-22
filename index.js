const k8s = require('@kubernetes/client-node'), 
      vault = require('node-vault'), 
      url = require('url'), 
      http = require('http'), 
      https = require('https'),
      assert = require('assert')
      request = require('request')
const kc = new k8s.KubeConfig()
const Watch = require('./watch.js').Watch

let send_queue = []
setInterval(() => {
  if(send_queue.length > 0) {
    let item = send_queue.shift()
    let connect = item.uri.protocol === 'https:' ? https : http
    let req = connect.request(item.request)
    if(process.env.DEBUG) {
      console.log('[debug] ' + item.request.method + ' ' + item.uri.protocol + '//' + item.uri.host + item.uri.path + ' ' + item.payload.key + ' ' + item.payload.action)
    }
    req.on('error', (e) => console.log(item.uri.protocol + '//' + item.uri.host + item.uri.path + ' failed ', e))
    req.write(JSON.stringify(item.payload, null, 2))
    req.end()
  }
}, 100)

function send(payload) {
  (process.env.NOTIFY || '')
    .split(',')
    .filter((x) => x !== ''.trim())
    .map((uri) => url.parse(uri))
    .forEach((uri) => {
      let headers = {'content-type':'application/json'}
      if(uri.auth && uri.auth.indexOf(':') === -1) {
        headers['authorization'] = uri.auth
        uri.auth = null
      }
      send_queue.push({request:Object.assign(uri, {method:'POST', headers}), payload, uri})
    })
}

async function checkPermissions() {
  const accessPods = { spec: { resourceAttributes: { verb: "watch", resource: "pods" } } };
  const accessDeployments = { spec: { resourceAttributes: { verb: "watch", resource: "deployment", group: "apps" } } };

  const k8sApi = kc.makeApiClient(k8s.AuthorizationV1Api);
  
  const canWatchPods = (await k8sApi.createSelfSubjectAccessReview(accessPods)).body.status.allowed;
  const canWatchDeployments = (await k8sApi.createSelfSubjectAccessReview(accessDeployments)).body.status.allowed;

  const errors = [];

  if (!canWatchPods) {
    errors.push('Service account must be able to watch pods at the cluster level.');
  }

  if (!canWatchDeployments) {
    errors.push('Service account must be able to watch deployments at the cluster level.')
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
  console.log('\nKubeconfig mode: Using ~/.kube/config...');
  try {
    assert.ok(process.env.HOME, 'The HOME environment variable was not found.')
    kc.loadFromFile(process.env['HOME'] + '/.kube/config');
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
    assert.ok(process.env.VAULT_ADDR, 'The VAULT_ADDR was not found.')
    assert.ok(process.env.VAULT_TOKEN, 'The VAULT_TOKEN was not found.')
    assert.ok(process.env.KUBERNETES_API_VERSION, 'The KUBERNETES_API_VERSION value was not found.')
    assert.ok(process.env.KUBERNETES_CONTEXT, 'The KUBERNETES_CONTEXT value was not found.')
    assert.ok(process.env.KUBERNETES_API_SERVER, 'The KUBERNETES_API_SERVER value was not found.')

    if(!process.env.VAULT_ADDR.startsWith('http')) {
      process.env.VAULT_ADDR = 'https://' + process.env.VAULT_ADDR
    }

    if(!process.env.KUBERNETES_API_SERVER.startsWith('http')) {
      process.env.KUBERNETES_API_SERVER = 'https://' + process.env.KUBERNETES_API_SERVER
    }
    
    let vc = vault({apiVersion:'v1', endpoint:process.env.VAULT_ADDR, token:process.env.VAULT_TOKEN})

    let cert = (await vc.read(process.env.KUBERNETES_CERT_SECRET)).data
    assert.ok(cert['ca-crt'], 'The ca-crt was not found within the vault kubernetes secret')

    let token;
    if (process.env.KUBERNETES_TOKEN_SECRET) {
      token = (await vc.read(process.env.KUBERNETES_TOKEN_SECRET)).data
    } else {
      assert.ok(cert['admin-crt'], 'The admin-crt was not found within the vault kubernetes secret')
      assert.ok(cert['admin-key'], 'The admin-key was not found within the vault kubernetes secret')
    }

    const cluster = {
      name: `akkeris-${process.env.KUBERNETES_CONTEXT}-cluster`,
      server: `${process.env.KUBERNETES_API_SERVER}`,
      caData: (Buffer.from(cert['ca-crt'], 'utf8')).toString('base64'),
    };

    const user = {
      name: `akkeris-${process.env.KUBERNETES_CONTEXT}-admin`,
      token: token ? token.token : undefined,
      certData: !token ? Buffer.from(cert['admin-crt'], 'utf8').toString('base64') : undefined,
      keyData: !token ? Buffer.from(cert['admin-key'], 'utf8').toString('base64') : undefined,
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

async function connect_kube() {
  console.log('Connecting to kubernetes...');

  if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT && (await loadFromCluster())) {
    console.log('Successfully connected to Kubernetes in-cluster!')
  } else if (!process.env.KUBERNETES_API_SERVER && (await loadFromKubeConfig())) {
    console.log('Successfully connected to Kubernetes via kubeconfig!')
    if(process.env.KUBERNETES_CONTEXT) {
      kc.setCurrentContext(process.env.KUBERNETES_CONTEXT)
    }
  } else if ((await loadFromVault())) {
    console.log('Successfully connected to Kubernetes by reading from Vault!')
    if(process.env.KUBERNETES_CONTEXT) {
      kc.setCurrentContext(process.env.KUBERNETES_CONTEXT)
    }
  } else {
    throw new Error('Failed to connect to Kubernetes - All available connection methods failed.');
  }

  kc.applyToRequest({forever:true, headers:{}})
}

function done(message, launch, err) {
  if (err) {
    console.error(err)
  }
  console.log('== rewatching for ' + message)
  launch()
}

let reported_crashed = {}

// Clear the crashed cache every 30 minutes
setInterval(() => { reported_crashed = {} }, 30 * 60 * 1000)

function exit_code_indicates_crash(exit_code) {
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
  
  if (exit_code !== 0 &&   // Successful exit
      exit_code !== 126 && // Ignore, we catch this other places, its not technically a crash
      exit_code !== 127 && // Ignore, we catch this other places, its not technically a crash
      exit_code !== 130 && // Ignore this, its an explicit stop sent by kubernetes 
      exit_code !== 143 && // Ignore this, its the SIGTERM sent by kubernetes
      exit_code !== 15) {  // Ignore this, its the SIGTERM sent without a bash termianl by kubernetes
    return true  
  } else {
    return false
  }
}

function crashed(type, obj) {
  // Make sure the event has the correct structure (ignores other types of events)
  if(!obj.metadata || !obj.metadata.labels || !obj.metadata.name || !obj.status) {
    return
  }

  // Parse app name and space name from metadata
  let app_name = obj.metadata.name.substring(0, obj.metadata.name.indexOf('--') === -1 ? obj.metadata.name.length : obj.metadata.name.indexOf('--'))
  let space_name = obj.metadata.namespace
  let app = `${app_name}-${space_name}`

  // Ignore legacy apps & TaaS tests
  if(app.endsWith('-taas') || app.startsWith("oct-")) {
    return
  }

  // Parse dyno type from metadata
  let dyno = obj.metadata.name.replace(`${obj.metadata.name}-`, '')
  let dyno_type = obj.metadata.name.indexOf('--') === -1 ? 'web' : obj.metadata.name.substring(obj.metadata.name.indexOf('--') + 2)

  // Detect whether or not this event indicates a crash

  // K8S can't schedule pod
  let scheduled = obj.status.phase === 'Pending' && obj.status.conditions && obj.status.conditions.filter((x) => x.reason === 'Unschedulable' && x.message && x.type === 'PodScheduled' && x.status === 'False').length > 0 

  // No K8S pod scheduling errors. 
  // All the next crashed indicators need obj.status.containerStatuses so if this isn't present, we're done
  if (!scheduled && !obj.status.containerStatuses) {
    return;
  }

  const containerStatuses = obj.status.containerStatuses;

  // Out Of Memory
  let oom = containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'OOMKilled')

  // App Crashed
  let crashed = containerStatuses.filter((x) => x.state.terminated && 
      x.state.terminated.reason === 'Error' && 
      x.state.terminated.exitCode !== 137 && 
      exit_code_indicates_crash(x.state.terminated.exitCode) || 
      x.state.waiting && 
      x.state.waiting.reason === 'CrashLoopBackOff' && 
      x.lastState &&
      x.lastState.terminated &&
      exit_code_indicates_crash(x.lastState.terminated.exitCode)
    )
  
  // App still creating
  let creating = crashed.length === 0 && containerStatuses.filter((x) => x.state.waiting && x.state.waiting.reason === 'ContainerCreating')

  // Ignore duplicate crashed events
  if(reported_crashed[app + dyno] && creating.length === 0) {
    return
  }
  
  // App never started
  let command = containerStatuses.filter((x) => x.state.terminated && 
    x.state.terminated.reason === 'ContainerCannotRun' || 
    x.state.waiting && 
    x.state.waiting.reason === 'CrashLoopBackOff' && 
    x.lastState.terminated && 
    x.lastState.terminated.reason === 'ContainerCannotRun')

  // App exited prematurely
  let premature = !obj.metadata.deletionTimestamp ? containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'Completed') : []

  // Error pulling image
  let image = crashed.length === 0 && containerStatuses.filter((x) => x.state.waiting && (x.state.waiting.reason === 'ImagePullBackOff' || x.state.waiting.reason === 'ErrImagePull'))
  
  // App hasn't started up in time
  let readiness = (crashed.length === 0 && obj.status.phase === 'Running') ? containerStatuses.filter((x) => x.state.running && x.state.running.startedAt && (((new Date(x.state.running.startedAt)).getTime() + (60 * 1000)) < Date.now()) && x.ready === false && dyno_type === 'web') : []

  // Unused crash indicators
  let reasons = containerStatuses.map((x) => x.state.terminated ? x.state.terminated.reason : '').join(',')
  let restarting = readiness.length > 0 && creating.length > 0 ? true : false

  // Nothing in event that would indicate a crash.
  if(oom.length === 0 && crashed.length === 0 && command.length === 0 && premature.length === 0 && readiness.length === 0 && image.length === 0 && !scheduled) {
    return
  }

  // Parse number of restarts
  let restarts = containerStatuses ? containerStatuses.map((x) => x.restartCount || 0).reduce((a, b) => a + b, []) : 0
  if(typeof restarts === 'string') {
    restarts = parseInt(restarts, 10)
  }

  // Set description of crash in order of priority
  let description = (oom.length > 0 ? "Memory quota exceeded" :
      (crashed.length > 0 ? "App crashed" :
      (command.length > 0 ? "App did not startup" :
      (readiness.length > 0 ? "App boot timeout" :
      (premature.length > 0 ? "App exited prematurely" :
      (scheduled ? "Platform limit error" :
      (image.length > 0 ? "Platform error" : "Unknown error")))))))
  let code = (oom.length > 0 ? "R14" :
      (crashed.length > 0 ? "H10" :
      (command.length > 0 ? "H9" :
      (readiness.length > 0 ? "H20" :
      (premature.length > 0 ? "H8" :
      (scheduled ? "H98" :
      (image.length > 0 ? "H99" : "H0")))))))

  // Add crash to cache (for duplicate detection)
  reported_crashed[app + dyno] = obj

  let payload = {
    "app":{
      "name":app_name
    },
    "space":{
      "name":space_name
    },
    "dynos":[
      {dyno, type:dyno_type}
    ],
    "key":app,
    "action":"crashed",
    description,
    code,
    restarts,
    "crashed_at":(new Date(Date.now())).toISOString()
  }

  process.env.DEBUG && console.log("[debug] app crashed:", JSON.stringify(payload, null, 2), 'type', JSON.stringify(type, null, 2), 'obj', JSON.stringify(obj, null, 2))
  
  if(process.env.TEST_MODE) {
    return payload
  } else {
    console.log(`** ${app} crashed ${code} (${description})\n`)
    // send(payload)
  }
}

function crashed_watch() {
  (new Watch(kc)).watch('/api/v1/pods', {}, crashed, done.bind(null, 'crashes', crashed_watch));
}

let last_release = {}
function released(type, obj) {
  // App objects will have the release-uuid in the metadata
  if(!(obj.metadata && obj.metadata.labels && Object.keys(obj.metadata.labels).includes("akkeris.io/release-uuid"))) {
    return;
  }

  process.env.DEBUG && console.log('[debug] received released candidate', type, JSON.stringify(obj, null, 2))

  const app_name = obj.metadata.labels["akkeris.io/app-name"]
  const space_name = obj.metadata.namespace
  const dyno_type = obj.metadata.labels["akkeris.io/dyno-type"]
  const app = `${app_name}-${space_name}`
  const image = obj.spec.template.spec.containers[0].image

  // Ignore objects that don't indicate that a release is completed
  if ( last_release[app] === image || 
      !(obj.status && obj.status.conditions) ||
      obj.status.conditions.filter((x) => x.type === 'Available' && x.status === 'True' ).length === 0 ||
      obj.status.observedGeneration !== obj.metadata.generation ||
      obj.status.availableReplicas !== obj.status.readyReplicas || 
      obj.status.readyReplicas !== obj.status.replicas || 
      obj.status.replicas !== obj.status.updatedReplicas ||
      app.endsWith('-taas') || 
      app.startsWith("oct-")
  ) {
    process.env.DEBUG && console.log('[debug] candidate did not meet requirements.')
    return
  }

  last_release[app] = image

  const payload = {
    "app":{
      "name":app_name
    },
    "space":{
      "name":space_name
    },
    "dyno":{
      "type": dyno_type,
    },
    "key":app,
    "action":"released",
    "slug":{
      image,
    },
    "released_at":new Date().toISOString()
  }

  process.env.DEBUG && console.log("[debug] app released:", JSON.stringify(payload, null, 2))

  if(process.env.TEST_MODE) {
    return payload
  } else {
    console.log(`** ${app} released ${image}`)
    // send(payload)
  }
}

function released_watch() {
  const path = '/apis/apps/v1beta1/deployments';
  (new Watch(kc)).watchNew(path, { includeUninitialized: false }, released, done.bind(null, 'releases', released_watch));
}

if(!process.env.TEST_MODE) {
  (async function() {
    try {
      await connect_kube()
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    released_watch()
    crashed_watch()
  })().catch((e) => console.error(e))
}

module.exports = {
  released,
  crashed
}

