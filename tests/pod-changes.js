const assert = require('assert');

/* eslint-disable */
module.exports = [
    // no error, just starting (0)
    {
      "test": "none",
      "test-phase": "starting",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "docs-585531626-rkcbr",
        "generateName": "docs-585531626-",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/pods/docs-585531626-rkcbr",
        "uid": "79457548-2c53-11e8-8f72-02638d829128",
        "resourceVersion": "398291678",
        "creationTimestamp": "2018-03-20T15:29:26Z",
        "labels": {
          "name": "docs",
          "pod-template-hash": "585531626"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"default\",\"name\":\"docs-585531626\",\"uid\":\"7942ccb0-2c53-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"398291673\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "docs-585531626",
            "uid": "7942ccb0-2c53-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-rlr0c",
            "secret": {
              "secretName": "default-token-rlr0c",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "docs",
            "image": "foo.akkeris.io/akkeris/docs-c7f5aeed-d33a-4436-9f75-1de3a6435a72:0.38",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [ ],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "128Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-rlr0c",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Pending",
        "conditions": [
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-20T15:29:26Z"
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // out of memory error (1)
    {
      "test": "crashed",
      "test-phase": "R14",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "sauceconnect-1977454990-pvlg9",
        "generateName": "sauceconnect-1977454990-",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/pods/sauceconnect-1977454990-pvlg9",
        "uid": "00bf7d11-259b-11e8-8f72-02638d829128",
        "resourceVersion": "398292335",
        "creationTimestamp": "2018-03-12T02:13:49Z",
        "labels": {
          "name": "sauceconnect",
          "pod-template-hash": "1977454990"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"default\",\"name\":\"sauceconnect-1977454990\",\"uid\":\"0ec0488b-56ba-11e7-b520-0259cc7b01e4\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"390209066\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "sauceconnect-1977454990",
            "uid": "0ec0488b-56ba-11e7-b520-0259cc7b01e4",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-rlr0c",
            "secret": {
              "secretName": "default-token-rlr0c",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "sauceconnect",
            "image": "foo.akkeris.io/akkeris/sauceconnect-6f0f46b4-cd79-4122-9e70-2a3d4d7060c7:0.12",
            "ports": [
              {
                "containerPort": 8000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "256Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-rlr0c",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 8000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:49Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-20T15:30:35Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [sauceconnect]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:49Z"
          }
        ],
        "hostIP": "10.84.26.250",
        "podIP": "10.2.82.26",
        "startTime": "2018-03-12T02:13:49Z",
        "containerStatuses": [
          {
            "name": "sauceconnect",
            "state": {
              "terminated": {
                "exitCode": 137,
                "reason": "OOMKilled",
                "startedAt": "2018-03-20T12:41:31Z",
                "finishedAt": "2018-03-20T15:30:35Z",
                "containerID": "docker://f2b58032f7b01d687cf42cd9ebbdb2a11dc85078f3f64477fc8baada9052b2bc"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 46,
            "image": "foo.akkeris.io/akkeris/sauceconnect-6f0f46b4-cd79-4122-9e70-2a3d4d7060c7:0.12",
            "imageID": "docker-pullable://foo.akkeris.io/akkeris/sauceconnect-6f0f46b4-cd79-4122-9e70-2a3d4d7060c7@sha256:0d2efadc8eb7604eb8d3089e788b34f0b7e514567b5e2b619e07b449df03db6e",
            "containerID": "docker://f2b58032f7b01d687cf42cd9ebbdb2a11dc85078f3f64477fc8baada9052b2bc"
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // error container crashed (2)
    {
      "test": "crashed",
      "test-phase": "H10",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "traffic-327722973-swd0t",
        "generateName": "traffic-327722973-",
        "namespace": "perf-dev",
        "selfLink": "/api/v1/namespaces/perf-dev/pods/traffic-327722973-swd0t",
        "uid": "bca94c41-2899-11e8-8f72-02638d829128",
        "resourceVersion": "398272374",
        "creationTimestamp": "2018-03-15T21:42:19Z",
        "labels": {
          "name": "traffic",
          "pod-template-hash": "327722973"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"perf-dev\",\"name\":\"traffic-327722973\",\"uid\":\"bca66ee6-2899-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"394433735\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "traffic-327722973",
            "uid": "bca66ee6-2899-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-kj8wb",
            "secret": {
              "secretName": "default-token-kj8wb",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "traffic",
            "image": "foo.akkeris.io/akkeris/traffic-6332a1ee-d756-4044-b563-c24745ed4579:0.5",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "512Mi"
              },
              "requests": {
                "memory": "256Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-kj8wb",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-15T21:42:19Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-15T21:42:19Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [traffic]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-15T21:42:19Z"
          }
        ],
        "hostIP": "10.84.26.75",
        "podIP": "10.2.107.20",
        "startTime": "2018-03-15T21:42:19Z",
        "containerStatuses": [
          {
            "name": "traffic",
            "state": {
              "terminated": {
                "exitCode": 1,
                "reason": "Error",
                "startedAt": "2018-03-20T14:55:31Z",
                "finishedAt": "2018-03-20T14:55:32Z",
                "containerID": "docker://e8a7d2878c714d2c378c3e84f730c264f18e7c472220d4a3e67dba47e5a1a430"
              }
            },
            "lastState": {
              "terminated": {
                "exitCode": 1,
                "reason": "Error",
                "startedAt": "2018-03-20T14:50:19Z",
                "finishedAt": "2018-03-20T14:50:20Z",
                "containerID": "docker://8c7cc19a3784235b952590a313c1d0f52753071b1e2473ddb0444ccb660c5d71"
              }
            },
            "ready": false,
            "restartCount": 140,
            "image": "foo.akkeris.io/akkeris/traffic-6332a1ee-d756-4044-b563-c24745ed4579:0.5",
            "imageID": "docker-pullable://foo.akkeris.io/akkeris/traffic-6332a1ee-d756-4044-b563-c24745ed4579@sha256:96bcf8df5758a420a231d42265f0427eafa64ff72ae4ef1ffd486dfed6b4bbc3",
            "containerID": "docker://e8a7d2878c714d2c378c3e84f730c264f18e7c472220d4a3e67dba47e5a1a430"
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // error image pull (3)
    {
      "test": "crashed",
      "test-phase": "H99",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "servicetest-3328967126-k311k",
        "generateName": "servicetest-3328967126-",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/pods/servicetest-3328967126-k311k",
        "uid": "e54548f4-259a-11e8-8f72-02638d829128",
        "resourceVersion": "398271839",
        "creationTimestamp": "2018-03-12T02:13:03Z",
        "labels": {
          "name": "servicetest",
          "pod-template-hash": "3328967126"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"default\",\"name\":\"servicetest-3328967126\",\"uid\":\"ee3cd012-6300-11e6-b7ad-06468cfee103\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"391134853\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "servicetest-3328967126",
            "uid": "ee3cd012-6300-11e6-b7ad-06468cfee103",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-rlr0c",
            "secret": {
              "secretName": "default-token-rlr0c",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "servicetest",
            "image": "registry.akkeris.io/akkeris/servicetest-0ab6a703-1919-4b8f-8c87-a3b13e9ee5e2:0.2",
            "ports": [
              {
                "containerPort": 5000,
                "protocol": "TCP"
              }
            ],
            "env": [ ],
            "resources": {},
            "volumeMounts": [
              {
                "name": "default-token-rlr0c",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "pull-secret"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Pending",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:03Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:03Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [servicetest]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:03Z"
          }
        ],
        "hostIP": "10.84.26.124",
        "podIP": "10.2.1.16",
        "startTime": "2018-03-12T02:13:03Z",
        "containerStatuses": [
          {
            "name": "servicetest",
            "state": {
              "waiting": {
                "reason": "ErrImagePull",
                "message": "rpc error: code = 2 desc = Error response from daemon: {\"message\":\"Get https://registry.akkeris.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)\"}"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 0,
            "image": "registry.akkeris.io/akkeris/servicetest-0ab6a703-1919-4b8f-8c87-a3b13e9ee5e2:0.2",
            "imageID": ""
          }
        ],
        "qosClass": "BestEffort"
      }
    },
    // error container prematurely exited (4)
    {
      "test": "crashed",
      "test-phase": "H8",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "sixers-3911549925-wxw76",
        "generateName": "sixers-3911549925-",
        "namespace": "oasis-stage",
        "selfLink": "/api/v1/namespaces/oasis-stage/pods/sixers-3911549925-wxw76",
        "uid": "01d3ea23-259b-11e8-8f72-02638d829128",
        "resourceVersion": "398271559",
        "creationTimestamp": "2018-03-12T02:13:51Z",
        "labels": {
          "name": "sixers",
          "pod-template-hash": "3911549925"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"oasis-stage\",\"name\":\"sixers-3911549925\",\"uid\":\"20b49ac5-219d-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"387611250\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "sixers-3911549925",
            "uid": "20b49ac5-219d-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-pgpkn",
            "secret": {
              "secretName": "default-token-pgpkn",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "sixers",
            "image": "foo.akkeris.io/akkeris/sixers-909e10c1-6fa2-4b35-9a28-f396fb549176:0.18",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "128Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-pgpkn",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:51Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:51Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [sixers]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-12T02:13:51Z"
          }
        ],
        "hostIP": "10.84.26.250",
        "podIP": "10.2.82.27",
        "startTime": "2018-03-12T02:13:51Z",
        "containerStatuses": [
          {
            "name": "sixers",
            "state": {
              "terminated": {
                "exitCode": 0,
                "reason": "Completed",
                "startedAt": "2018-03-20T14:54:04Z",
                "finishedAt": "2018-03-20T14:54:04Z",
                "containerID": "docker://90a79ae7ca9719e12cd293201c03820d57143214963f67607cb6296fbac1054f"
              }
            },
            "lastState": {
              "terminated": {
                "exitCode": 0,
                "reason": "Completed",
                "startedAt": "2018-03-20T14:48:58Z",
                "finishedAt": "2018-03-20T14:48:58Z",
                "containerID": "docker://7de48c5ef95ea5e220bae3062156ed6e39b3d4b4917ad0dac43565a2ae06f6b7"
              }
            },
            "ready": false,
            "restartCount": 1071,
            "image": "foo.akkeris.io/akkeris/sixers-909e10c1-6fa2-4b35-9a28-f396fb549176:0.18",
            "imageID": "docker-pullable://foo.akkeris.io/akkeris/sixers-909e10c1-6fa2-4b35-9a28-f396fb549176@sha256:56f62e61ae2e8d6fe1c68fc4dcfb3800b1b5de5bd47dbb516211c4049fe842a3",
            "containerID": "docker://90a79ae7ca9719e12cd293201c03820d57143214963f67607cb6296fbac1054f"
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // error container crashed (5)
    {
      "test": "crashed",
      "test-phase": "H10",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "useraccount-1058445535-c5qpt",
        "generateName": "useraccount-1058445535-",
        "namespace": "perf-stg",
        "selfLink": "/api/v1/namespaces/perf-stg/pods/useraccount-1058445535-c5qpt",
        "uid": "82ed4535-27c1-11e8-8f72-02638d829128",
        "resourceVersion": "398270277",
        "creationTimestamp": "2018-03-14T19:54:31Z",
        "labels": {
          "name": "useraccount",
          "pod-template-hash": "1058445535"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"perf-stg\",\"name\":\"useraccount-1058445535\",\"uid\":\"82e975fa-27c1-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"393536473\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "useraccount-1058445535",
            "uid": "82e975fa-27c1-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-yudxj",
            "secret": {
              "secretName": "default-token-yudxj",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "useraccount",
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "2Gi"
              },
              "requests": {
                "memory": "1536Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-yudxj",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [useraccount]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          }
        ],
        "hostIP": "10.11.11.11",
        "podIP": "10.11.22.22",
        "startTime": "2018-03-14T19:54:31Z",
        "containerStatuses": [
          {
            "name": "useraccount",
            "state": {
              "waiting": {
                "reason": "CrashLoopBackOff",
                "message": "Back-off 2m40s restarting failed container=useraccount pod=useraccount-1058445535-c5qpt_perf-stg(82ed4535-27c1-11e8-8f72-02638d829128)"
              }
            },
            "lastState": {
              "terminated": {
                "exitCode": 255,
                "reason": "Error",
                "startedAt": "2018-03-20T14:50:07Z",
                "finishedAt": "2018-03-20T14:50:08Z",
                "containerID": "docker://b916f62ae7bd49607781b7307113c4dfd7836d2a5e0ea6e72436f861b5241c29"
              }
            },
            "ready": false,
            "restartCount": 1,
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "imageID": ""
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // error start command failed (6)
    {
      "test": "crashed",
      "test-phase": "H9",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "valla-2409362411-x2r2c",
        "generateName": "valla-2409362411-",
        "namespace": "ned",
        "selfLink": "/api/v1/namespaces/ned/pods/valla-2409362411-x2r2c",
        "uid": "f01d414c-2bb7-11e8-a31d-02f50d315afc",
        "resourceVersion": "104340160",
        "creationTimestamp": "2018-03-19T20:56:04Z",
        "labels": {
          "name": "valla",
          "pod-template-hash": "2409362411"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"ned\",\"name\":\"valla-2409362411\",\"uid\":\"f1d5e8ec-270a-11e8-aedd-067ff9eea312\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"104112655\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "valla-2409362411",
            "uid": "f1d5e8ec-270a-11e8-aedd-067ff9eea312",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-vc571",
            "secret": {
              "secretName": "default-token-vc571",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "valla",
            "image": "foo.akkeris.io/akkeris/valla-d4f7aed3-39ab-481c-8f6e-47187746106f:0.5",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "256Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-vc571",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-19T20:56:04Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-19T20:56:04Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [valla]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-19T20:56:04Z"
          }
        ],
        "hostIP": "10.84.25.147",
        "podIP": "10.2.90.7",
        "startTime": "2018-03-19T20:56:04Z",
        "containerStatuses": [
          {
            "name": "valla",
            "state": {
              "waiting": {
                "reason": "CrashLoopBackOff",
                "message": "Back-off 2m40s restarting failed container=valla pod=valla-2409362411-x2r2c_ned(f01d414c-2bb7-11e8-a31d-02f50d315afc)"
              }
            },
            "lastState": {
              "terminated": {
                "exitCode": 127,
                "reason": "ContainerCannotRun",
                "message": "invalid header field value \"oci runtime error: container_linux.go:247: starting container process caused \\\"exec: \\\\\\\"bin/start.sh\\\\\\\": stat bin/start.sh: no such file or directory\\\"\\n\"",
                "startedAt": "2018-03-20T14:49:24Z",
                "finishedAt": "2018-03-20T14:49:24Z",
                "containerID": "docker://d8064011c2be5d12b7b8f9d086a86611cb3f16b0d9942253c164883bafc1d358"
              }
            },
            "ready": false,
            "restartCount": 0,
            "image": "foo.akkeris.io/akkeris/valla-d4f7aed3-39ab-481c-8f6e-47187746106f:0.5",
            "imageID": ""
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // not responding on port error (7)
    {
      "test":"crashed",
      "test-phase":"H20",
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
          "annotations": {
              "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"iakkeris\",\"name\":\"docsbeta-3934880710\",\"uid\":\"a33cc590-e77c-11e8-9b92-06fe87e8b7fa\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"586035660\"}}\n"
          },
          "creationTimestamp": "2018-11-13T19:45:13Z",
          "generateName": "docsbeta-3934880710-",
          "labels": {
              "app": "docsbeta",
              "name": "docsbeta",
              "pod-template-hash": "3934880710",
              "version": "v1"
          },
          "name": "docsbeta-3934880710-r7731",
          "namespace": "iakkeris",
          "ownerReferences": [
              {
                  "apiVersion": "extensions/v1beta1",
                  "blockOwnerDeletion": true,
                  "controller": true,
                  "kind": "ReplicaSet",
                  "name": "docsbeta-3934880710",
                  "uid": "a33cc590-e77c-11e8-9b92-06fe87e8b7fa"
              }
          ],
          "resourceVersion": "586035716",
          "selfLink": "/api/v1/namespaces/iakkeris/pods/docsbeta-3934880710-r7731",
          "uid": "a33fb135-e77c-11e8-9b92-06fe87e8b7fa"
      },
      "spec": {
          "containers": [
              {
                  "env": [ ],
                  "image": "/ff/docsbeta-d63ce1a7-fcdf-4085-8022-c2f9a939f4b9:0.12",
                  "imagePullPolicy": "Always",
                  "name": "docsbeta",
                  "ports": [
                      {
                          "containerPort": 9002,
                          "protocol": "TCP"
                      }
                  ],
                  "readinessProbe": {
                      "failureThreshold": 3,
                      "periodSeconds": 10,
                      "successThreshold": 1,
                      "tcpSocket": {
                          "port": 9002
                      },
                      "timeoutSeconds": 1
                  },
                  "resources": {
                      "limits": {
                          "memory": "256Mi"
                      },
                      "requests": {
                          "memory": "128Mi"
                      }
                  },
                  "securityContext": {
                      "capabilities": {}
                  },
                  "terminationMessagePath": "/dev/termination-log",
                  "terminationMessagePolicy": "File",
                  "volumeMounts": [
                      {
                          "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
                          "name": "default-token-3b75c",
                          "readOnly": true
                      }
                  ]
              }
          ],
          "dnsPolicy": "ClusterFirst",
          "imagePullSecrets": [
              {
                  "name": "foo"
              }
          ],
          "nodeName": "",
          "restartPolicy": "Always",
          "schedulerName": "default-scheduler",
          "securityContext": {},
          "serviceAccount": "default",
          "serviceAccountName": "default",
          "terminationGracePeriodSeconds": 30,
          "volumes": [
              {
                  "name": "default-token-3b75c",
                  "secret": {
                      "defaultMode": 420,
                      "secretName": "default-token-3b75c"
                  }
              }
          ]
      },
      "status": {
          "conditions": [
              {
                  "lastProbeTime": null,
                  "lastTransitionTime": "2018-11-13T19:45:13Z",
                  "status": "True",
                  "type": "Initialized"
              },
              {
                  "lastProbeTime": null,
                  "lastTransitionTime": "2018-11-13T19:45:13Z",
                  "message": "containers with unready status: [docsbeta]",
                  "reason": "ContainersNotReady",
                  "status": "False",
                  "type": "Ready"
              },
              {
                  "lastProbeTime": null,
                  "lastTransitionTime": "2018-11-13T19:45:13Z",
                  "status": "True",
                  "type": "PodScheduled"
              }
          ],
          "containerStatuses": [
              {
                  "containerID": "docker://27fe9a47eda96cffec1478f38d913e47d096614d2101ad74df2000f8fcc3deb9",
                  "image": "",
                  "imageID": "",
                  "lastState": {},
                  "name": "docsbeta",
                  "ready": false,
                  "restartCount": 0,
                  "state": {
                      "running": {
                          "startedAt": "2018-11-13T19:45:16Z"
                      }
                  }
              }
          ],
          "hostIP": "10.84.16.125",
          "phase": "Running",
          "podIP": "10.2.81.4",
          "qosClass": "Burstable",
          "startTime": "2018-11-13T19:45:13Z"
      }
    },
    // cannot schedule due to nodes being full (8)
    {
      "test": "crashed",
      "test-phase": "H98",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "abcd-2519598803-fjvwq",
        "generateName": "abcd-2519598803-",
        "namespace": "test",
        "selfLink": "/api/v1/namespaces/f1v1/pods/abcd-2519598803-fjvwq",
        "uid": "6d40dd17-310f-11e8-a31d-02f50d315afc",
        "resourceVersion": "106177558",
        "creationTimestamp": "2018-03-26T16:04:56Z",
        "labels": {
          "name": "abcd",
          "pod-template-hash": "2519598803"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"test\",\"name\":\"abcd-2519598803\",\"uid\":\"6d3afd78-310f-11e8-a31d-02f50d315afc\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"106177549\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "abcd-2519598803",
            "uid": "6d3afd78-310f-11e8-a31d-02f50d315afc",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-rf03t",
            "secret": {
              "secretName": "default-token-rf03t",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "abcd",
            "image": "registry.example.com/blerg/abcd-9ba36825-ad83-4ad3-9adb-c3db80617832:0.25",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "32Gi"
              },
              "requests": {
                "memory": "32Gi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-rf03t",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "example.registry.com-blerg"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Pending",
        "conditions": [
          {
            "type": "PodScheduled",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-26T16:04:56Z",
            "reason": "Unschedulable",
            "message": "No nodes are available that match all of the following predicates:: Insufficient memory (5), PodToleratesNodeTaints (1)."
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // Nothing wrong just a container being created (9)
    {
      "test": "none",
      "test-phase": "starting",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "api--worker-7f594565c-5hhzn",
        "generateName": "api--worker-7f594565c-",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/pods/api--worker-7f594565c-5hhzn",
        "uid": "d88891ee-e776-11e8-8ccf-062291b3f7b2",
        "resourceVersion": "39487391",
        "creationTimestamp": "2018-11-13T19:03:45Z",
        "labels": {
          "app": "api--worker",
          "name": "api--worker",
          "pod-template-hash": "391501217",
          "version": "v1"
        },
        "annotations": {
          "cni.projectcalico.org/podIP": "10.2.11.106/32"
        },
        "ownerReferences": [
          {
            "apiVersion": "apps/v1",
            "kind": "ReplicaSet",
            "name": "api--worker-7f594565c",
            "uid": "d8819e67-e776-11e8-8ccf-062291b3f7b2",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-ftg9z",
            "secret": {
              "secretName": "default-token-ftg9z",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "api--worker",
            "image": "/api-fa2b535d-de4d-4a14-be36-d44af53b59e3:0.6",
            "command": [
              "node",
              "worker.js"
            ],
            "env": [ ],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "256Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-ftg9z",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always",
            "securityContext": {
              "capabilities": {}
            }
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo"
          }
        ],
        "schedulerName": "default-scheduler",
        "tolerations": [
          {
            "key": "node.kubernetes.io/not-ready",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          },
          {
            "key": "node.kubernetes.io/unreachable",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          }
        ],
        "priority": 0
      },
      "status": {
        "phase": "Pending",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-11-13T19:03:46Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-11-13T19:03:46Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [api--worker]"
          },
          {
            "type": "ContainersReady",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": null,
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [api--worker]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-11-13T19:03:45Z"
          }
        ],
        "hostIP": "10.84.15.9",
        "startTime": "2018-11-13T19:03:46Z",
        "containerStatuses": [
          {
            "name": "api--worker",
            "state": {
              "waiting": {
                "reason": "ContainerCreating"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 0,
            "image": "api-fa2b535d-de4d-4a14-be36-d44af53b59e3:0.6",
            "imageID": ""
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // Nothing wrong just a release that occured (10)
    {
      "test": "none",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "useraccount-1058445535-c5qpt",
        "generateName": "useraccount-1058445535-",
        "namespace": "perf-stg",
        "selfLink": "/api/v1/namespaces/perf-stg/pods/useraccount-1058445535-c5qpt",
        "uid": "82ed4535-27c1-11e8-8f72-02638d829128",
        "resourceVersion": "398270277",
        "creationTimestamp": "2018-03-14T19:54:31Z",
        "labels": {
          "name": "useraccount",
          "pod-template-hash": "1058445535"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"perf-stg\",\"name\":\"useraccount-1058445535\",\"uid\":\"82e975fa-27c1-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"393536473\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "useraccount-1058445535",
            "uid": "82e975fa-27c1-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-yudxj",
            "secret": {
              "secretName": "default-token-yudxj",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "useraccount",
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "2Gi"
              },
              "requests": {
                "memory": "1536Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-yudxj",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [useraccount]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          }
        ],
        "hostIP": "10.11.11.11",
        "podIP": "10.11.22.22",
        "startTime": "2018-03-14T19:54:31Z",
        "containerStatuses": [
          {
            "name": "useraccount",
            "state": {
              "waiting": {
                "reason": "CrashLoopBackOff",
                "message": "Back-off 2m40s restarting failed container=useraccount pod=useraccount-1058445535-c5qpt_perf-stg(82ed4535-27c1-11e8-8f72-02638d829128)"
              }
            },
            "lastState": {
              "terminated": {
                "exitCode": 143,
                "reason": "Error",
                "startedAt": "2018-03-20T14:50:07Z",
                "finishedAt": "2018-03-20T14:50:08Z",
                "containerID": "docker://b916f62ae7bd49607781b7307113c4dfd7836d2a5e0ea6e72436f861b5241c29"
              }
            },
            "ready": false,
            "restartCount": 1,
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "imageID": ""
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // Nothing wrong just a release that occured (11)
    {
      "test": "none",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "useraccount-1058445535-c5qpt",
        "generateName": "useraccount-1058445535-",
        "namespace": "perf-stg",
        "selfLink": "/api/v1/namespaces/perf-stg/pods/useraccount-1058445535-c5qpt",
        "uid": "82ed4535-27c1-11e8-8f72-02638d829128",
        "resourceVersion": "398270277",
        "creationTimestamp": "2018-03-14T19:54:31Z",
        "labels": {
          "name": "useraccount",
          "pod-template-hash": "1058445535"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"perf-stg\",\"name\":\"useraccount-1058445535\",\"uid\":\"82e975fa-27c1-11e8-8f72-02638d829128\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"393536473\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "useraccount-1058445535",
            "uid": "82e975fa-27c1-11e8-8f72-02638d829128",
            "controller": true,
            "blockOwnerDeletion": true
          }
        ]
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-yudxj",
            "secret": {
              "secretName": "default-token-yudxj",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "useraccount",
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "ports": [
              {
                "containerPort": 9000,
                "protocol": "TCP"
              }
            ],
            "env": [],
            "resources": {
              "limits": {
                "memory": "2Gi"
              },
              "requests": {
                "memory": "1536Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-yudxj",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always"
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "Default",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "foobar.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "foo.akkeris.io-akkeris"
          }
        ],
        "schedulerName": "default-scheduler"
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [useraccount]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-14T19:54:31Z"
          }
        ],
        "hostIP": "10.11.11.11",
        "podIP": "10.11.22.22",
        "startTime": "2018-03-14T19:54:31Z",
        "containerStatuses": [
          {
            "name": "useraccount",
            "state": {
              "terminated": {
                "exitCode":143,
                "reason": "Error",
                "message": "Back-off 2m40s restarting failed container=useraccount pod=useraccount-1058445535-c5qpt_perf-stg(82ed4535-27c1-11e8-8f72-02638d829128)"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 1,
            "image": "foo.akkeris.io/akkeris/useraccount-84a01d67-27eb-4ad2-92ea-30b89f722248:0.33",
            "imageID": ""
          }
        ],
        "qosClass": "Burstable"
      }
    },
    // Nothing wrong, just the pod being deleted with the app [12]
    {
      "test": "none",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "pl1-6c9b4c75b6-952tg",
        "generateName": "pl1-6c9b4c75b6-",
        "namespace": "pipline-test-space1",
        "selfLink": "/api/v1/namespaces/pipline-test-space1/pods/pl1-6c9b4c75b6-952tg",
        "uid": "c6090dfe-1f44-11e9-902b-062291b3f7b2",
        "resourceVersion": "99727471",
        "creationTimestamp": "2019-01-23T19:26:25Z",
        "deletionTimestamp": "2019-01-23T19:27:42Z",
        "deletionGracePeriodSeconds": 30,
        "labels": {
          "app": "pl1",
          "name": "pl1",
          "pod-template-hash": "2756073162",
          "version": "v1"
        },
        "annotations": {
          "cni.projectcalico.org/podIP": "10.2.20.28/32"
        }
      },
      "spec": {
        "volumes": [
          {
            "name": "default-token-rpmjl",
            "secret": {
              "secretName": "default-token-rpmjl",
              "defaultMode": 420
            }
          }
        ],
        "containers": [
          {
            "name": "pl1",
            "image": "foobar.xyz.io/ab/pl1-2c3f9b87-9fbc-424e-894e-96adcf8ad743:0.2",
            "ports": [
              {
                "containerPort": 5000,
                "protocol": "TCP"
              }
            ],
            "env": [
              {
                "name": "ALAMO_SPACE",
                "value": "pipline-test-space1"
              },
              {
                "name": "ALAMO_DEPLOYMENT",
                "value": "pl1"
              },
              {
                "name": "ALAMO_APPLICATION",
                "value": "pl1-pipline-test-space1"
              },
              {
                "name": "PORT",
                "value": "5000"
              }
            ],
            "resources": {
              "limits": {
                "memory": "256Mi"
              },
              "requests": {
                "memory": "256Mi"
              }
            },
            "volumeMounts": [
              {
                "name": "default-token-rpmjl",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 5000
              },
              "timeoutSeconds": 1,
              "periodSeconds": 10,
              "successThreshold": 1,
              "failureThreshold": 3
            },
            "terminationMessagePath": "/dev/termination-log",
            "terminationMessagePolicy": "File",
            "imagePullPolicy": "Always",
            "securityContext": {
              "capabilities": {}
            }
          }
        ],
        "restartPolicy": "Always",
        "terminationGracePeriodSeconds": 30,
        "dnsPolicy": "ClusterFirst",
        "serviceAccountName": "default",
        "serviceAccount": "default",
        "nodeName": "ip-10-84-15-202.us-west-2.compute.internal",
        "securityContext": {},
        "imagePullSecrets": [
          {
            "name": "ff-xyz"
          }
        ],
        "schedulerName": "default-scheduler",
        "tolerations": [
          {
            "key": "node.kubernetes.io/not-ready",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          },
          {
            "key": "node.kubernetes.io/unreachable",
            "operator": "Exists",
            "effect": "NoExecute",
            "tolerationSeconds": 300
          }
        ],
        "priority": 0
      },
      "status": {
        "phase": "Running",
        "conditions": [
          {
            "type": "Initialized",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2019-01-23T19:26:25Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2019-01-23T19:27:13Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [pl1]"
          },
          {
            "type": "ContainersReady",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": null,
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [pl1]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2019-01-23T19:26:25Z"
          }
        ],
        "hostIP": "10.84.15.202",
        "podIP": "10.2.20.28",
        "startTime": "2019-01-23T19:26:25Z",
        "containerStatuses": [
          {
            "name": "pl1",
            "state": {
              "terminated": {
                "exitCode": 0,
                "reason": "Completed",
                "startedAt": "2019-01-23T19:26:29Z",
                "finishedAt": "2019-01-23T19:27:12Z",
                "containerID": "docker://3663f3d62f74a232344bd94e7b8a5f6a815201a52de3a24b4623b6c469321b2d"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 0,
            "image": "ff.xyz.io/dfy/pl1-2c3f9b87-9fbc-424e-894e-96adcf8ad743:0.2",
            "imageID": "docker-pullable://ff.xtz.io/abc/pl1-2c3f9b87-9fbc-424e-894e-96adcf8ad743@sha256:29128306f29e2105e71a8e28ef9960ff33ff1c1065fcf87c7111e9f38f6d351f",
            "containerID": "docker://3663f3d62f74a232344bd94e7b8a5f6a815201a52de3a24b4623b6c469321b2d"
          }
        ],
        "qosClass": "Burstable"
      }
    }
]
/* eslint-enable */

if (process.env.TEST_MODE) {
  const { crashed } = require('../index.js'); // eslint-disable-line
  module.exports.forEach((item, ndx) => {
    try {
      const result = crashed('MODIFIED', item);
      if (item.test === 'none') {
        assert.ok(!result, 'The result returned an error when none was expected.', item, result);
      } else {
        assert.ok(
          result.code === item['test-phase'],
          'The result code failed:', result.code, '!==', item['test-phase'], item.test,
        );
      }
      console.log('Test', ndx, 'passed.');
    } catch (e) {
      console.log('Test', ndx, 'failed.');
      console.log(e);
    }
  });
  process.exit(0);
}
