const k8s = require('@kubernetes/client-node'), 
      vault = require('node-vault'), 
      url = require('url'), 
      http = require('https'), 
      https = require('https')
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
    console.assert(process.env.VAULT_ADDR, 'The VAULT_ADDR was not found.')
    if(!process.env.VAULT_ADDR.startsWith('http')) {
      process.env.VAULT_ADDR = 'https://' + process.env.VAULT_ADDR
    }
    console.assert(process.env.VAULT_ADDR.startsWith('http'), 'VAULT_ADDR should be a url not a host.')
    console.assert(process.env.VAULT_TOKEN, 'The VAULT_TOKEN was not found.')
    console.assert(process.env.KUBERNETES_API_VERSION, 'The KUBERNETES_API_VERSION value was not found.')
    console.assert(process.env.KUBERNETES_CONTEXT, 'The KUBERNETES_CONTEXT value was not found.')
    console.assert(process.env.KUBERNETES_API_SERVER, 'The KUBERNETES_API_SERVER value was not found.')
    let vc = vault({apiVersion:'v1', endpoint:process.env.VAULT_ADDR, token:process.env.VAULT_TOKEN})
    if(!process.env.KUBERNETES_TOKEN_SECRET) {
      let cert = (await vc.read(process.env.KUBERNETES_CERT_SECRET)).data
      console.assert(cert['ca-crt'], 'The ca-crt was not found within the vault kubernetes secret')
      console.assert(cert['admin-crt'], 'The admin-crt was not found within the vault kubernetes secret')
      console.assert(cert['admin-key'], 'The admin-key was not found within the vault kubernetes secret')
      kc.loadFromString(`
        apiVersion: ${process.env.KUBERNETES_API_VERSION}
        clusters:
        - cluster:
            certificate-authority-data: ${(new Buffer(cert['ca-crt'])).toString('base64')}
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
            client-certificate-data: ${(new Buffer(cert['admin-crt'])).toString('base64')}
            client-key-data: ${(new Buffer(cert['admin-key'])).toString('base64')}`)
    } else {
      let cert = (await vc.read(process.env.KUBERNETES_CERT_SECRET)).data
      let token = (await vc.read(process.env.KUBERNETES_TOKEN_SECRET)).data
      console.assert(cert['ca-crt'], 'The ca-crt was not found within the vault kubernetes secret')
      kc.loadFromString(`
        apiVersion: ${process.env.KUBERNETES_API_VERSION}
        clusters:
        - cluster:
            insecure-skip-tls-verify: 'true'
            certificate-authority-data: ${(new Buffer(cert['ca-crt'])).toString('base64')}
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
setInterval(() => { reported_crashed = {} }, 10 * 60 * 1000)

function crashed(type, obj) {
  if(!obj.metadata || !obj.metadata.labels || !obj.metadata.labels.name || !obj.status) {
    return
  }

  let app_name = obj.metadata.labels.name.substring(0, obj.metadata.labels.name.indexOf('--') === -1 ? obj.metadata.labels.name.length : obj.metadata.labels.name.indexOf('--'))
  let space_name = obj.metadata.namespace
  let app = `${app_name}-${space_name}`
  if(app.endsWith('-taas') || app.startsWith("oct-")) {
    return
  }

  // TODO: detect a zombie pod?
  let dyno = obj.metadata.name.replace(`${obj.metadata.labels.name}-`, '')
  let dyno_type = obj.metadata.labels.name.indexOf('--') === -1 ? 'web' : obj.metadata.labels.name.substring(obj.metadata.labels.name.indexOf('--') + 2)
  let reasons = obj.status.containerStatuses ? obj.status.containerStatuses.map((x) => x.state.terminated ? x.state.terminated.reason : '').join(',') : []

  let oom = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'OOMKilled') : []
  let crashed = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && 
      x.state.terminated.reason === 'Error' && 
      x.state.terminated.exitCode !== 137 || 
      x.state.waiting && 
      x.state.waiting.reason === 'CrashLoopBackOff' && 
      x.lastState &&
      x.lastState.terminated &&
      x.lastState.terminated.exitCode !== 127
    ) : []
  let command = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && 
    x.state.terminated.reason === 'ContainerCannotRun' || 
    x.state.waiting && 
    x.state.waiting.reason === 'CrashLoopBackOff' && 
    x.lastState.terminated && 
    x.lastState.terminated.reason === 'ContainerCannotRun') : []
  let premature = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.terminated && x.state.terminated.reason === 'Completed') : []
  let creating = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.waiting && x.state.waiting.reason === 'ContainerCreating') : []
  let image = obj.status.containerStatuses ? obj.status.containerStatuses.filter((x) => x.state.waiting && (x.state.waiting.reason === 'ImagePullBackOff' || x.state.waiting.reason === 'ErrImagePull')) : []
  let readiness = command.length === 0 && 
                  crashed.length === 0 && 
                  premature.length === 0 && 
                  image.length === 0 && 
                  creating.length === 0 &&
                  (obj.status.conditions ? 
                    obj.status.conditions.filter((x) => 
                      dyno_type === 'web' && 
                      x.type === 'Ready' && 
                      x.status === 'False' && 
                      x.reason === 'ContainersNotReady'
                    ) : [])
  let scheduled = obj.status.phase === 'Pending' && obj.status.conditions && obj.status.conditions.filter((x) => x.reason === 'Unschedulable' && x.message && x.type === 'PodScheduled' && x.status === 'False').length > 0
  let restarts = obj.status.containerStatuses ? obj.status.containerStatuses.map((x) => x.restartCount || 0).reduce((a, b) => a + b, []) : 0
  
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

  process.env.DEBUG && console.log("[debug] app crashed:", JSON.stringify(payload, null, 2))
  
  if(process.env.TEST_MODE) {
    return payload
  } else {
    console.log(`** ${app} crashed ${code} (${description})`)
    send(payload)
  }
  // TODO: influx db annotation
}

function crashed_watch() {
  let req = (new Watch(kc)).watch('/api/v1/pods', {}, crashed, done.bind(null, 'crashes', crashed_watch));
}


let last_release = {}
function released(type, obj) {
  // listen to the right types of messages, check the structure for needed
  // fields, this may have a more explicit way of detecting the right types
  // of messages, but i'm not sure what it is :/.
  if(!(
    obj.status && obj.status.conditions && 
    obj.metadata &&  obj.metadata.labels && obj.metadata.labels.name && obj.metadata.namespace &&
    obj.spec && obj.spec.template && obj.spec.template.spec && obj.spec.template.spec.containers && obj.spec.template.spec.containers[0]
  )) {
    return
  }

  let app_name = obj.metadata.labels.name.substring(0, obj.metadata.labels.name.indexOf('--') === -1 ? obj.metadata.labels.name.length : obj.metadata.labels.name.indexOf('--'))
  let space_name = obj.metadata.namespace
  let app = `${app_name}-${space_name}`
  let image = obj.spec.template.spec.containers[0].image

  if(type === 'ADDED') {
    last_release[app] = image
    return
  }

  if (
    image !== last_release[app] && 
    obj.status.conditions.filter((x) => x.type === 'Available' && x.status === 'True' ).length > 0 && 
    // must be an observation of the current generation
    obj.status.observedGeneration === obj.metadata.generation &&
    !obj.status.unavailableReplicas &&
    type === 'MODIFIED'
  ) {
    
    if(app.endsWith('-taas') || app.startsWith("oct-")) {
      return
    }

    let dyno_type = obj.metadata.labels.name.indexOf('--') === -1 ? 'web' : obj.metadata.labels.name.substring(obj.metadata.labels.name.indexOf('--') + 2)
    last_release[app] = image
    let payload = {
      "app":{
        "name":app_name
      },
      "space":{
        "name":space_name
      },
      "key":app,
      "action":"released",
      "slug":{
        image,
      },
      "released_at":(new Date(Date.now())).toISOString()
    }
    if(process.env.DEBUG) {
      console.log("[debug] app released:", JSON.stringify(payload, null, 2))
    }
    if(process.env.TEST_MODE) {
      return payload
    } else {
      console.log(`** ${app} released ${image}`)
      send(payload)
    }
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

