#!/bin/bash

# Get name of the container that is currently running. Possible in array?
# microk8s kubectl get pods --no-headers -o custom-columns=":metadata.name"

# This will get all of the pod name and store in variable podName
# Example below
# uat-develop-portal-api-5ccf99d46f-l5tqb uat-develop-portal-api-5ccf99d46f-x5psl uat-develop-portal-frontend-b7c7c95d-wl94n
podName=$(microk8s kubectl get pods --no-headers -o custom-columns=":metadata.name")
# echo $podName

# This will slice the pod name, example below
# uat-develop-portal-api-5ccf99d46f-l5tqb
# uat-develop-portal-api-5ccf99d46f-x5psl
# uat-develop-portal-frontend-b7c7c95d-wl94n  

# Remote into a container, Replace $PodName with the pod name
# microk8s kubectl exec --stdin --tty $PodName -- /bin/bash

for pod in $podName
do
    # microk8s kubectl exec --stdin --tty $PodName -- /bin/bash
    # cd /var
    # exit
done
