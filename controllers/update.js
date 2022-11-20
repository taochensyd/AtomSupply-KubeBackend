const shell = require("shelljs");

const update = (request, response) => {
  // shell.exec('../ShellScript/updateKubePod.sh')

  console.log(request.body);
  console.log(request.body.image);

  if ((request.body.image == "atomportal") & (request.body.tag == "develop")) {
    response.json({
      kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
    }); // echo the result back
    //shell.exec('../ShellScript/updatePortalAPI.sh')
    shell.exec('microk8s kubectl rollout restart deployment uat-develop-portal-api')
  }

  if (
    (request.body.image == "atomportal_frontend") &
    (request.body.tag == "develop")
  ) {
    response.json({
      kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
    }); // echo the result back
    shell.exec('../ShellScript/updatePortalFrontend.sh')
  }

  if ((request.body.image == "crmcard_ui") & (request.body.tag == "master")) {
    response.json({
      kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
    }); // echo the result back
    shell.exec('../ShellScript/updateCrmCard.sh')
  }

  console.log(request.body.tag);
  console.log(request.body.token);
};

module.exports = {
  update,
};
