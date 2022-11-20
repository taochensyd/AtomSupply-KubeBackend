#!/bin/bash

echo "Restarting Deployment"
currentDate=`date`
echo $currentDate

echo $(microk8s kubectl rollout restart deployment uat-develop-portal-api)
echo $(microk8s kubectl rollout restart deployment uat-develop-portal-frontend)
echo $(microk8s kubectl rollout restart deployment uat-master-crmcard-ui)
