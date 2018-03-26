# Akkeris Application Watcher

The application watcher serves as a webhook notification system for kubernetes events of interest such as:

* When a pod crashes
* When a pod fails to find a node to run on (overloaded nodes)
* When a new release of an image takes place on an existing deployment or new deployment
* When a pod fails to start due to a bad start command
* When a pod fails to pass its health checks.

## Setup

The following environment variables are required for it to function:

* `VAULT_ADDR` - The API host (not URL) for Hashicorp vault.
* `VAULT_TOKEN` - The token to use for vault
* `KUBERNETES_API_SERVER` - The API host (not URL) for kubernetes.
* `KUBERNETES_CERT_SECRET` - The path where to read in kubernetes cert secrets within vault (e.g, /secret/kubernetes/certs), see Kubernetes Certs for more information on format.
* `KUBERNETES_API_VERSION` - Kubernetes API version to use, this should be set to v1 as no other version is currently supported.
* `KUBERNETES_CONTEXT` - If multiple contexts are available within a store, which to use.
* `NOTIFY` - A comma delimited list of end points to send notifications to, these can be either http or https.

OR alternatively, you can instruct application watcher to read the kube config from its home directory by setting:

* `HOME` - This indicates where to read the kubeconfig from, usually for development (`$HOME/.kube/config` is read in).
* `NOTIFY` - A comma delimited list of end points to send notifications to, these can be either http or https.
* `KUBERNETES_CONTEXT` - If multiple contexts are available within a store, which to use.

Start with `node index.js` or `npm run` (either one works fine)

### Kubernetes Certs

Within vault a secret should be placed with the following properties:

1. `ca-crt` which contains the certificate authority as a PEM encoded field.
2. `admin-crt` which contains the certificate for the administrative role used for watching pods/deployments. This should be PEM encoded.
3. `admin-key` which contains the key for the administrative role used for watching pods/deployments.  This should be PEM encoded.

The path to this secret (e.g., `/secrets/kubernetes/certs` or whatever your path may be) should be placed in the environment variable `KUBERNETES_CERT_SECRET`.  Note that this section is not required if the configuration is read from a file.

## Development and Testing

In the setup section just set the `KUBERNETES_CONTEXT`, set `NOTIFY` to a mock bin to see the results, and ensure you have `$HOME/.kube/config` setup. You can alternatively set:

1. `TEST_MODE` - Bails out early of certain calls and allow unit tests to function, must be set when running tests, not very useful while developing.
2. `DEBUG` - Set up debug mode causes it to print out what its sending and what it receives.  Useful for development.

To test run `npm test`.

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
