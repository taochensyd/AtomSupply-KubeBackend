const shell = require("shelljs");
// import fetch from ("node-fetch");
const webToken = "Web-User";

const kubePorts = [
  31000, 31001, 31002, 30000, 30001, 30003, 30011, 30012, 31011, 31012, 32011,
  32012,
];

const kubemanagement = (request, response) => {
  /*
        request body:
        {
            portID:31000,
            action: update or undoUpdate

        }
    
    */

  if (request.body.token !== "Web-User") {
    response.status(400).send("Invalid Token");
  } else if (request.body.token === "Web-User") {
    // response.status(200).send("web management controller.");
    makePostUpdateRequest({
      token: "Web-User",
      environment: "uat",
      image: "atomportal_frontend",
      tag: "develop",
    });
  } else {
    response.status(400).send("Invalid Parameters");
  }
};

// function makePostUpdateRequest(body) {
//   fetch("https://kube-api-endpoint.atom.com.au/update", {
//     Method: "POST",
//     Headers: {
//       Accept: "application.json",
//       "Content-Type": "application/json",
//     },
//     Body: body,
//     Cache: "default",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       return data;
//     });
// }

module.exports = {
  kubemanagement,
};

