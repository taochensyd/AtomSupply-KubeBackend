#!/bin/bash

echo "Restarting Deployment"
currentDate=`date`
echo $currentDate

echo $(microk8s kubectl rollout restart deployment uat-develop-portal-api)
sleep 15s
echo $(microk8s kubectl rollout restart deployment uat-develop-portal-api)