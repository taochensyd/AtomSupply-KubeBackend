#!/bin/bash

function restartDeployment(){
    echo "Restarting Deployment"
    currentDate=`date`
    echo $currentDate

    echo $(microk8s kubectl rollout restart deployment uat-develop-portal-api)
    sleep 1s

    echo $(microk8s kubectl rollout restart deployment uat-develop-portal-frontend)
    sleep 1s

    echo $(microk8s kubectl rollout restart deployment uat-master-crmcard-ui)
    sleep 900s
}

x=1
while [ $x -eq 1 ]
do
    restartDeployment
done




