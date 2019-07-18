const k8s = require('@kubernetes/client-node'), 
      vault = require('node-vault'), 
      url = require('url'), 
      http = require('http'), 
      https = require('https'),
      assert = require('assert')
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

async function connect_kube() {
  if(!process.env.KUBERNETES_API_SERVER) {
    kc.loadFromFile(process.env['HOME'] + '/.kube/config');
  } else {
    assert.ok(process.env.VAULT_ADDR, 'The VAULT_ADDR was not found.')
    if(!process.env.VAULT_ADDR.startsWith('http')) {
      process.env.VAULT_ADDR = 'https://' + process.env.VAULT_ADDR
    }
    assert.ok(process.env.VAULT_ADDR.startsWith('http'), 'VAULT_ADDR should be a url not a host.')
    assert.ok(process.env.VAULT_TOKEN, 'The VAULT_TOKEN was not found.')
    assert.ok(process.env.KUBERNETES_API_VERSION, 'The KUBERNETES_API_VERSION value was not found.')
    assert.ok(process.env.KUBERNETES_CONTEXT, 'The KUBERNETES_CONTEXT value was not found.')
    assert.ok(process.env.KUBERNETES_API_SERVER, 'The KUBERNETES_API_SERVER value was not found.')
    let vc = vault({apiVersion:'v1', endpoint:process.env.VAULT_ADDR, token:process.env.VAULT_TOKEN})
    if(!process.env.KUBERNETES_TOKEN_SECRET) {
      let cert = (await vc.read(process.env.KUBERNETES_CERT_SECRET)).data
      assert.ok(cert['ca-crt'], 'The ca-crt was not found within the vault kubernetes secret')
      assert.ok(cert['admin-crt'], 'The admin-crt was not found within the vault kubernetes secret')
      assert.ok(cert['admin-key'], 'The admin-key was not found within the vault kubernetes secret')
      kc.loadFromString(`
        apiVersion: ${process.env.KUBERNETES_API_VERSION}
        clusters:
        - cluster:
            certificate-authority-data: ${(Buffer.from(cert['ca-crt'], 'utf8')).toString('base64')}
            server: https://${process.env.KUBERNETES_API_SERVER}
          name: alamo-${process.env.KUBERNETES_CONTEXT}-cluster
        contexts:
        - context:
            cluster: alamo-${process.env.KUBERNETES_CONTEXT}-cluster
            namespace: kube-system
            user: alamo-${process.env.KUBERNETES_CONTEXT}-admin
          name: ${process.env.KUBERNETES_CONTEXT}
        current-context: ${process.env.KUBERNETES_CONTEXT}
        kind: Config
        preferences: {}
        users:
        - name: alamo-${process.env.KUBERNETES_CONTEXT}-admin
          user:
            client-certificate-data: ${(Buffer.from(cert['admin-crt'], 'utf8')).toString('base64')}
            client-key-data: ${(Buffer.from(cert['admin-key'], 'utf8')).toString('base64')}`)
    } else {
      let cert = (await vc.read(process.env.KUBERNETES_CERT_SECRET)).data
      let token = (await vc.read(process.env.KUBERNETES_TOKEN_SECRET)).data
      assert.ok(cert['ca-crt'], 'The ca-crt was not found within the vault kubernetes secret')
      kc.loadFromString(`
        apiVersion: ${process.env.KUBERNETES_API_VERSION}
        clusters:
        - cluster:
            insecure-skip-tls-verify: 'true'
            certificate-authority-data: ${(Buffer.from(cert['ca-crt'], 'utf8')).toString('base64')}
            server: https://${process.env.KUBERNETES_API_SERVER}
          name: alamo-${process.env.KUBERNETES_CONTEXT}-cluster
        contexts:
        - context:
            cluster: alamo-${process.env.KUBERNETES_CONTEXT}-cluster
            namespace: kube-system
            user: alamo-${process.env.KUBERNETES_CONTEXT}-admin
          name: ${process.env.KUBERNETES_CONTEXT}
        current-context: ${process.env.KUBERNETES_CONTEXT}
        kind: Config
        preferences: {}
        users:
        - name: alamo-${process.env.KUBERNETES_CONTEXT}-admin
          user:
            token: ${token.token}`)
    }
  }
  if(process.env.KUBERNETES_CONTEXT) {
    kc.setCurrentContext(process.env.KUBERNETES_CONTEXT)
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
  if(!obj.metadata || !obj.metadata.labels || !obj.metadata.name || !obj.status) {
    return
  }

  let app_name = obj.metadata.name.substring(0, obj.metadata.name.indexOf('--') === -1 ? obj.metadata.name.length : obj.metadata.name.indexOf('--'))
  let space_name = obj.metadata.namespace
  let app = `${app_name}-${space_name}`

  if(app.endsWith('-taas') || app.startsWith("oct-")) {
    return
  }

  let dyno = obj.metadata.name.replace(`${obj.metadata.name}-`, '')
  let dyno_type = obj.metadata.name.indexOf('--') === -1 ? 'web' : obj.metadata.name.substring(obj.metadata.name.indexOf('--') + 2)
  let reasons = obj.status.containerStatuses ? obj.status.containerStatuses.map((x) => x.state.terminated ? x.state.terminated.reason : '').join(',') : []

  let oom = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'OOMKilled') : []
  let crashed = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && 
      x.state.terminated.reason === 'Error' && 
      x.state.terminated.exitCode !== 137 && 
      exit_code_indicates_crash(x.state.terminated.exitCode) || 
      x.state.waiting && 
      x.state.waiting.reason === 'CrashLoopBackOff' && 
      x.lastState &&
      x.lastState.terminated &&
      exit_code_indicates_crash(x.lastState.terminated.exitCode)
    ) : []
  let command = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && 
    x.state.terminated.reason === 'ContainerCannotRun' || 
    x.state.waiting && 
    x.state.waiting.reason === 'CrashLoopBackOff' && 
    x.lastState.terminated && 
    x.lastState.terminated.reason === 'ContainerCannotRun') : []
  let premature = (obj.status.containerStatuses && !obj.metadata.deletionTimestamp) ? obj.status.containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'Completed') : []
  let creating = crashed.length === 0 && obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.waiting && x.state.waiting.reason === 'ContainerCreating') : []
  let image = crashed.length === 0 && obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.waiting && (x.state.waiting.reason === 'ImagePullBackOff' || x.state.waiting.reason === 'ErrImagePull')) : []
  let scheduled = obj.status.phase === 'Pending' && obj.status.conditions && obj.status.conditions.filter((x) => x.reason === 'Unschedulable' && x.message && x.type === 'PodScheduled' && x.status === 'False').length > 0
  let restarts = obj.status.containerStatuses ? obj.status.containerStatuses.map((x) => x.restartCount || 0).reduce((a, b) => a + b, []) : 0
  let readiness = (crashed.length === 0 && obj.status.phase === 'Running' && obj.status.containerStatuses) ? obj.status.containerStatuses.filter((x) => x.state.running && x.state.running.startedAt && (((new Date(x.state.running.startedAt)).getTime() + (60 * 1000)) < Date.now()) && x.ready === false && dyno_type === 'web') : []

  if(typeof restarts === 'string') {
    restarts = parseInt(restarts, 10)
  }

  let restarting = readiness.length > 0 && creating.length > 0 ? true : false
  
  if(reported_crashed[app + dyno] && creating.length === 0) {
    return
  }

  if(oom.length === 0 && crashed.length === 0 && command.length === 0 && premature.length === 0 && readiness.length === 0 && image.length === 0 && !scheduled) {
    return
  }

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
    console.log(`** ${app} crashed ${code} (${description})`)
    send(payload)
  }
}

function crashed_watch() {
  let req = (new Watch(kc)).watch('/api/v1/pods', {}, crashed, done.bind(null, 'crashes', crashed_watch));
}

function get_dyno_type(name) {
  return name.indexOf('--') === -1 ? 'web' : name.substring(name.indexOf('--') + 2)
}

let last_release = {}
function released(type, obj) {
  // listen to the right types of messages, check the structure for needed
  // fields, this may have a more explicit way of detecting the right types
  // of messages, but i'm not sure what it is :/.
  if(!(
    obj.status && obj.status.conditions && 
    obj.metadata &&  obj.metadata.labels && obj.metadata.name && obj.metadata.namespace && obj.metadata.creationTimestamp &&
    obj.spec && obj.spec.template && obj.spec.template.spec && obj.spec.template.spec.containers && obj.spec.template.spec.containers[0]
  )) {
    return
  }

  let app_name = obj.metadata.name.substring(0, obj.metadata.name.indexOf('--') === -1 ? obj.metadata.name.length : obj.metadata.name.indexOf('--'))
  let space_name = obj.metadata.namespace
  let app = `${app_name}-${space_name}`
  let image = obj.spec.template.spec.containers[0].image
  let create_date = new Date(obj.metadata.creationTimestamp)

  process.env.DEBUG && console.log('received released', type, JSON.stringify(obj, null, 2))

  if(type === 'ADDED' && (create_date.getTime()  + 1000 * 60 * 5) < Date.now()) {
    // This is a cached update, it was added to the cache, its not a new deployment.
    last_release[app] = image
    return
  }

  if ( last_release[app] === image || 
      obj.status.conditions.filter((x) => x.type === 'Available' && x.status === 'True' ).length === 0 ||
      obj.status.observedGeneration !== obj.metadata.generation ||
      obj.status.availableReplicas !== obj.status.readyReplicas || 
      obj.status.readyReplicas !== obj.status.replicas || 
      obj.status.replicas !== obj.status.updatedReplicas ||
      app.endsWith('-taas') || 
      app.startsWith("oct-")
  ) {
    return
  }

  last_release[app] = image

  let payload = {
    "app":{
      "name":app_name
    },
    "space":{
      "name":space_name
    },
    "dyno":{
      "type": get_dyno_type(obj.metadata.name),
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
    send(payload)
  }
}

function released_watch() {
  let req = (new Watch(kc)).watch('/apis/apps/v1beta1/deployments', {includeUninitialized:false}, released, done.bind(null, 'releases', released_watch));
}


if(!process.env.TEST_MODE) {
  (async function() {
    process.stdout.write('Connecting to kubernetes. ')
    await connect_kube()
    released_watch()
    crashed_watch()
    process.stdout.write('done\n')
  })().catch((e) => console.error(e))
}

module.exports = {
  released,
  crashed
}

