const shell = require("shelljs");
const fs = require("fs");

const BekkerToken = "2sGMxTwKeClnILXa3aK2";

const update = (request, response) => {
  if (request.body.token !== BekkerToken) {
    response.status(401).send("Invalid token!");
  } else if (
    request.body.token === BekkerToken
    // request.body.environment.length() > 0 &&
    // request.body.image.length() > 0 &&
    // request.body.tag.length() > 0

    // request.body.environment in request.body &&
    // request.body.image in request.body &&
    // request.body.tag in request.body
  ) {
    // shell.exec('../ShellScript/updateKubePod.sh')

    // console.log(request.body);
    // console.log(request.body.image);

    if (
      (request.body.image.toLowerCase() == "atomportal") &
      (request.body.tag.toLowerCase() == "develop") &
      (request.body.environment.toLowerCase() == "uat")
    ) {
      shell.exec(
        "microk8s kubectl rollout restart deployment uat-develop-portal-api"
      );
      getTimestamp(request.body);
      response.json({
        kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
      }); // echo the result back
      //shell.exec('../ShellScript/updatePortalAPI.sh')
    } else if (
      (request.body.image.toLowerCase() == "atomportal_frontend") &
      (request.body.tag.toLowerCase() == "develop") &
      (request.body.environment.toLowerCase() == "uat")
    ) {
      shell.exec(
        "microk8s kubectl rollout restart deployment uat-develop-portal-frontend"
      );
      response.json({
        kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
      }); // echo the result back
    } else if (
      (request.body.image.toLowerCase() == "crmcard_ui") &
      (request.body.tag.toLowerCase() == "master") &
      (request.body.environment.toLowerCase() == "uat")
    ) {
      shell.exec(
        "microk8s kubectl rollout restart deployment uat-master-crmcard-ui"
      );
      response.json({
        kubeUpdate: `${request.body.image}:${request.body.tag} has been successfully updated`,
      }); // echo the result back
    } else {
      response.status(400).send("Invalid Parameters");
    }

    // console.log(request.body.tag);
    // console.log(request.body.token);
  }
};

// Log the timestamp to local log.txt file.

async function getTimestamp(postParams) {
  try {
    // let currentTimestamp = await shell.exec("date");
    console.log(`${shell.exec("date")}${postParams.environment}:${postParams.image}:${postParams.tag}`);
    // await fs.appendFileSync("updateLog.txt", `${shell.exec("date")}${postParams}`);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  update,
};
