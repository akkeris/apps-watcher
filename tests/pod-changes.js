
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
      "test": "crashed",
      "test-phase": "H20",
      "kind": "Pod",
      "apiVersion": "v1",
      "metadata": {
        "name": "dnsmonitor-1297707119-rdtc3",
        "generateName": "dnsmonitor-1297707119-",
        "namespace": "abcd",
        "selfLink": "/api/v1/namespaces/abcd/pods/dnsmonitor-1297707119-rdtc3",
        "uid": "c7645857-2d05-11e8-a31d-02f50d315afc",
        "resourceVersion": "104621742",
        "creationTimestamp": "2018-03-21T12:45:47Z",
        "deletionTimestamp": "2018-03-21T12:48:26Z",
        "deletionGracePeriodSeconds": 0,
        "labels": {
          "name": "dnsmonitor",
          "pod-template-hash": "1297707119"
        },
        "annotations": {
          "kubernetes.io/created-by": "{\"kind\":\"SerializedReference\",\"apiVersion\":\"v1\",\"reference\":{\"kind\":\"ReplicaSet\",\"namespace\":\"abcd\",\"name\":\"dnsmonitor-1297707119\",\"uid\":\"c761ea1c-2d05-11e8-a31d-02f50d315afc\",\"apiVersion\":\"extensions\",\"resourceVersion\":\"104621037\"}}\n"
        },
        "ownerReferences": [
          {
            "apiVersion": "extensions/v1beta1",
            "kind": "ReplicaSet",
            "name": "dnsmonitor-1297707119",
            "uid": "c761ea1c-2d05-11e8-a31d-02f50d315afc",
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
            "name": "dnsmonitor",
            "image": "foo.akkeris.io/akkeris/dnsmonitor-272c24e1-7368-4a45-a65a-d6493f956400:0.2",
            "ports": [
              {
                "containerPort": 9001,
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
                "name": "default-token-rf03t",
                "readOnly": true,
                "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount"
              }
            ],
            "readinessProbe": {
              "tcpSocket": {
                "port": 9001
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
            "lastTransitionTime": "2018-03-21T12:45:47Z"
          },
          {
            "type": "Ready",
            "status": "False",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-21T12:48:57Z",
            "reason": "ContainersNotReady",
            "message": "containers with unready status: [dnsmonitor]"
          },
          {
            "type": "PodScheduled",
            "status": "True",
            "lastProbeTime": null,
            "lastTransitionTime": "2018-03-21T12:45:47Z"
          }
        ],
        "hostIP": "10.11.22.1",
        "startTime": "2018-03-21T12:45:47Z",
        "containerStatuses": [
          {
            "name": "dnsmonitor",
            "state": {
              "terminated": {
                "exitCode": 137,
                "reason": "Error",
                "startedAt": "2018-03-21T12:45:53Z",
                "finishedAt": "2018-03-21T12:48:56Z",
                "containerID": "docker://8e673f9b5026265fd67ac9023515b05bc51d09ff40316b1966a78352a8d5571e"
              }
            },
            "lastState": {},
            "ready": false,
            "restartCount": 0,
            "image": "foo.akkeris.io/akkeris/dnsmonitor-272c24e1-7368-4a45-a65a-d6493f956400:0.2",
            "imageID": "docker-pullable://foo.akkeris.io/akkeris/dnsmonitor-272c24e1-7368-4a45-a65a-d6493f956400@sha256:6c1e35a41a620562e0c16e072356cfb34c55c60a67b9736750af8204868aab77",
            "containerID": "docker://8e673f9b5026265fd67ac9023515b05bc51d09ff40316b1966a78352a8d5571e"
          }
        ],
        "qosClass": "Burstable"
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
    }
]

if(process.env.TEST_MODE) {
    const {released, crashed } = require('../index.js')
    module.exports.forEach((item, ndx) => {
        let result = crashed('MODIFIED', item)
        if(item.test === 'none') {
            console.assert(!result, 'The result returned an error when none was expected.', item, result)
        } else {
            console.assert(result.code === item["test-phase"], 'The result code failed:', result.code, '!==', item["test-phase"], item['test'])
        }
        console.log('Test', ndx, 'passed.')
    })
    process.exit(0)
}