# Akkeris Application Watcher

The application watcher serves as a webhook notification system for kubernetes events of interest such as:

* When a pod crashes
* When a pod fails to find a node to run on (overloaded nodes)
* When a new release of an image takes place on an existing deployment or new deployment
* When a pod fails to start due to a bad start command
* When a pod fails to pass its health checks.

## Setup

### Required Environment Variables

* `NOTIFY`  - Set this to a comma delimited list of end points to send notifications to. These can be either http or https.

### Authenticating to Kubernetes

There are three methods that can be used to connect/authenticate to Kubernetes. In order of precedence, these methods are in-cluster, kubeconfig, and vault. If one method fails, the next method will be tried as a fallback until no methods remain.

#### In-Cluster

If running as a pod, the apps-watcher will first try to connect to the Kubernetes cluster hosting the pod. This uses the service account that Kubernetes places in `/var/run/secrets/kubernetes.io/serviceaccount`. The apps-watcher knows it's running as a pod by checking for the presence of the `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT` environment variables injected by Kubernetes.

#### Kubeconfig

If in-cluster authentication fails, the apps-watcher will try to use the kubeconfig from its home directory. The following environment variables should be set if this authentication method is desired:

* `HOME` - The location of the home directory. The kubeconfig file will be read from `$HOME/.kube/config`.
* `KUBERNETES_CONTEXT` - If multiple contexts are available in the kubeconfig, this indicates which one to use.

#### Vault

If both in-cluster and kubeconfig authentication fails, the apps-watcher will try to authenticate using a token stored in Vault. The following environment variables should be set if this authentication is desired:

* `VAULT_ADDR` - The API host for Hashicorp Vault.
* `VAULT_TOKEN` - The token to use for connecting to Vault.
* `KUBERNETES_TOKEN_SECRET` - The path in vault where the Kubernetes token is stored (e.g. `secret/k8s/token`). This should have a field `token` containing the Kubernetes token.
* `KUBERNETES_API_SERVER` - The API host for Kubernetes.
* `KUBERNETES_CONTEXT` - If multiple contexts are available, specify the context to use.

## Running

```
npm install
npm start
```

## Development and Testing

For local development, it's best to use the kubeconfig authentication method.

* Ensure that `$HOME/.kube/config` exists and is properly configured.
* Set `KUBERNETES_CONTEXT` to the appropriate cluster found in the kubeconfig file.
* Set `NOTIFY` to a mock endpoint to view results (for example, you could use https://postb.in/ to create an endpoint)

The following environment variables are also available for testing and development purposes:

* `TEST_MODE` - Must be set when running tests - Bails out early of certain calls and allow unit tests to function.
* `DEBUG` - Print extra information about what is received and sent by the apps-watcher

To test, run `npm test`.

### Reproducing Failed Pods

1. Reproducing an unschedulable pod can be done by taking any existing deployment and putting a resource limit on memory larger than any node in the cluster (e.g., 32Gi).
2. To reproduce an out of memory app see `tests/outofmemory` it contains an example Dockerfile/app that slowly incurs memory until it runs out, set the limit on it to 64Mi.
3. Setting the wrong port on `tests/outofmemory` will also trigger a failure to boot code.
4. Setting an incorrect start command (override dockerfile CMD/ENTRYPOINT) in `tests/outofmemory` 

### Events Payloads

There are two types of events `released` and `crashed`. Each is sent via a `POST` operation to every url in the `$NOTIFY` comma seperated list.

*Crashed*

`POST /endpoint/in/notify/env`

```json
{
  "app":{
    "name":"testapp"
  },
  "space":{
    "name":"thespace"
  },
  "dynos":[
    {
      "dyno":"389233991.aed11", 
      "type":"web"
    }
  ],
  "key":"testapp-thespace",
  "action":"crashed",
  "description":"Description of what caused the crash",
  "code":"H20",
  "restarts":0,
  "crashed_at":"2016-07-18T14:55:38.190Z"
}
```

*Released*

`POST /endpoint/in/notify/env`

```json
{
  "app":{
    "name":"testapp"
  },
  "space":{
    "name":"thespace"
  },
  "key":"testapp-thespace",
  "action":"released",
  "slug":{
    "image":"registry.example.com/repo/image:tag",
  },
  "released_at":"2016-07-18T14:55:38.190Z"
}
```


### Codes

When an application crashes the following codes may be used:

* `R14 - Memory quota exceeded`
* `H10 - App Crashed`
* `H9 - App did not startup`
* `H20 - App boot timeout`
* `H8 - App exited prematurely`
* `H98 - Platform limit error` (app failed to find a node to launch on)
* `H99 - Platform error` (usually image failed to pull)
* `H0 - Unknown error` (no known cause, but app cannot run) 
