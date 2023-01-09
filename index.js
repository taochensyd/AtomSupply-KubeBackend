const express = require("express");
const app = express();
// const update = require("./routes/update");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const shell = require("shelljs");
const BekkerToken = "2sGMxTwKeClnILXa3aK2";
const script = require("./data/shellScript.json");
const { toASCII } = require("punycode");
const { exec } = require("child_process");
const YAML = require('json-to-pretty-yaml');
const dataScriptCLI = [];
const dataConsoleLogs = [];
const dataVariables = [];
const dataErrorsLogs = [];
const k8sPodsJSON = [];

// Reading data from local json file
// Read log's ID
(function () {
  fs.readFile("./data/variables.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    dataVariables.push(JSON.parse(jsonString));
  });
})();

// Read Script Command from JSON array
(function () {
  fs.readFile("./data/shellScript.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let temp = JSON.parse(jsonString);
    dataScriptCLI.push(temp);
    console.log(dataScriptCLI[0]);
  });
})();

// dataConsoleLogs[]
(function () {
  fs.readFile("./data/consoleLogs.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    } else if ((jsonString === "") | (jsonString === null)) {
      console.log("Empty JSON file");
      return;
    }
    let temp = JSON.parse(jsonString);
    for (let i = 0; i < temp.length; i++) {
      dataConsoleLogs.push(temp[i]);
    }
  });
})();

// dataErrorsLogs[]
(function () {
  fs.readFile("./data/errorLogs.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    } else if ((jsonString === "") | (jsonString === null)) {
      console.log("Empty JSON file");
      return;
    }
    let temp = JSON.parse(jsonString);
    for (let i = 0; i < temp.length; i++) {
      dataErrorsLogs.push(temp[i]);
    }
  });
})();

// Write logs to JSON files

function writeErrorLogsToJsonFile(nextID, errorLogs, arguements) {
  let currentTimeStamp = new Date();
  let content = {
    ID: nextID,
    DateTime: `${currentTimeStamp.getHours()}:${currentTimeStamp.getMinutes()}:${currentTimeStamp.getSeconds()}`,
    Date: `${currentTimeStamp.getDate()}/${currentTimeStamp.getMonth() + 1
      }/${currentTimeStamp.getFullYear()}`,
    Message: errorLogs,
    Parameter: arguements,
  };
  console.log(content);

  dataErrorsLogs.push(content);
  console.log(dataErrorsLogs);

  fs.writeFile(
    "./data/errorLogs.json",
    JSON.stringify(dataErrorsLogs),
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
      dataVariables[0].errorLogsID = dataVariables[0].errorLogsID + 1;
      console.log(`dataVariables.errorLogsID: ${dataVariables[0].errorLogsID}`);
      writeVariablesToJsonFile(dataVariables[0]);
    }
  );
}

function writeConsoleLogsToJsonFile(nextID, logs, arguements) {
  let currentTimeStamp = new Date();
  let content = {
    ID: nextID,
    DateTime: `${currentTimeStamp.getHours()}:${currentTimeStamp.getMinutes()}:${currentTimeStamp.getSeconds()}`,
    Date: `${currentTimeStamp.getDate()}/${currentTimeStamp.getMonth() + 1
      }/${currentTimeStamp.getFullYear()}`,
    Message: logs,
    logParameter: arguements,
  };

  console.log(content);

  dataConsoleLogs.push(content);
  console.log(dataConsoleLogs);

  fs.writeFile(
    "./data/consoleLogs.json",
    JSON.stringify(dataConsoleLogs),
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully

      dataVariables[0].logsID = dataVariables[0].logsID + 1;
      console.log(`dataVariables.logsID: ${dataVariables[0].logsID}`);
      writeVariablesToJsonFile(dataVariables[0]);
    }
  );
}

function writeVariablesToJsonFile(newCounter) {
  let content = {
    logsID: newCounter.logsID,
    errorLogsID: newCounter.errorLogsID,
  };

  fs.writeFile(
    "./data/variables.json",
    JSON.stringify(content),
    { encoding: "utf8", flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
      // dataVariables
    }
  );
}

//end reading json file

//middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

//route
app.get("/", (req, res) => {
  // res.sendFile("views/index.html", { root: __dirname });
  // // res.sendFile("../AtomSupply-KubeFrontend/build/index.html", { root: __dirname });
  // res.sendFile(path.resolve(__dirname, '../AtomSupply-KubeFrontend/build/', 'index.html'));
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/hello", (req, res) => {
  res.send("NodeJS+Express");
});

app.get("/api/v1/getOutLog", (req, res) => {
  fs.readFile("../.pm2/logs/index-out.log", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // sendFile('views/logs.html', {root: __dirname })
    res.send(data);
  });
});

app.get("/api/v1/getErrorLog", (req, res) => {
  fs.readFile("../.pm2/logs/index-error.log", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // sendFile('views/logs.html', {root: __dirname })
    res.send(data);
  });
});

app.get("/api/v1/home/logs", (req, res) => {
  console.log(dataConsoleLogs);
  res.status(200).json(dataConsoleLogs);
});

app.get("/api/v1/home/errorlogs", (req, res) => {
  console.log(dataErrorsLogs);
  res.status(200).json(dataErrorsLogs);
});

app.get("/api/v1/k8s/getAllRunningPods", (req, res) => {
  let cli = "microk8s kubectl get pods -o=jsonpath='{.items}'";
  let temp = shell.exec(cli);
  // for(let i=0; i<json.length; i++) {
  k8sPodsJSON.push(temp.stdout);
  // }
  console.log(k8sPodsJSON[0]);
  res.status(200).json(k8sPodsJSON[0]);
});

// app.post("/update", (req, res) => {
//   if (req.body.token !== BekkerToken) {
//     res.status(401).send("Invalid token!");
//   } else if (req.body.token === BekkerToken) {
//     if (
//       (req.body.image.toLowerCase() == "atomportal") &
//       (req.body.tag.toLowerCase() == "develop") &
//       (req.body.environment.toLowerCase() == "uat")
//     ) {
//       // shell.exec(
//       //   "microk8s kubectl rollout restart deployment uat-develop-portal-api"
//       // );
//       shell.exec(`${dataScriptCLI[0].uatatomportaldevelop}`);
//       writeConsoleLogsToJsonFile(
//         dataVariables[0].logsID,
//         `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
//         req.body
//       );
//       // sendEmail().catch(console.error);
//       res.json({
//         kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
//       }); // echo the result back
//       //shell.exec('../ShellScript/updatePortalAPI.sh')
//     } else if (
//       (req.body.image.toLowerCase() == "atomportal_frontend") &
//       (req.body.tag.toLowerCase() == "develop") &
//       (req.body.environment.toLowerCase() == "uat")
//     ) {
//       // shell.exec(
//       //   "microk8s kubectl rollout restart deployment uat-develop-portal-frontend"
//       // );

//       // transporter.sendMail(mailOptions, function (error, info) {
//       //   if (error) {
//       //     console.log(error);
//       //   } else {
//       //     console.log("Email sent: " + info.res);
//       //   }
//       // });

//       shell.exec(`${dataScriptCLI[0].uatatomportalfrontenddevelop}`);
//       writeConsoleLogsToJsonFile(
//         dataVariables[0].logsID,
//         `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
//         req.body
//       );
//       res.json({
//         kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
//       }); // echo the result back
//     } else if (
//       (req.body.image.toLowerCase() == "crmcard_ui") &
//       (req.body.tag.toLowerCase() == "master") &
//       (req.body.environment.toLowerCase() == "uat")
//     ) {
//       // shell.exec(
//       //   "microk8s kubectl rollout restart deployment uat-master-crmcard-ui"
//       // );

//       shell.exec(`${dataScriptCLI[0].uatcrmcarduimaster}`);
//       writeConsoleLogsToJsonFile(
//         dataVariables[0].logsID,
//         `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
//         req.body
//       );
//       res.json({
//         kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
//       }); // echo the result back
//     } else {
//       writeErrorLogsToJsonFile(
//         dataVariables[0].errorLogsID,
//         "Invalid Parameters",
//         req.body
//       );

//       res.status(400).send("Invalid Parameters");
//     }
//   }
// });

app.post("/update", (req, res) => {
  let currentTimeStamp = shell.exec("date");
  let tempOutputObj = {
    Date: currentTimeStamp,
    message: ""
  }
  function checkOutput(output) {
    if (output.includes("restarted")) {
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        output,
        req.body
      );
      tempOutputObj.message = output;
      let postbackData = JSON.stringify(tempOutputObj)
      res.status(200).send(`${postbackData}`);
    } else {
      writeErrorLogsToJsonFile(
        dataVariables[0].errorLogsID,
        output,
        req.body
      );
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        output
      );
      tempOutputObj.message = output;
      let postbackData = JSON.stringify(tempOutputObj)
      res.status(400).send(`${postbackData}`);
    }
  }
  if (req.body.token !== BekkerToken) {
    res.status(401).send("Invalid token!");
  } else if (req.body.environment === "uat" && req.body.tag === "staging") {
    if (sendEmailToUpdate(req.body)) {
      tempOutputObj.message = "Email Sent";
      let postbackData = JSON.stringify(tempOutputObj)
      res.status(200).send(`${postbackData}`);
    } else {
      tempOutputObj.message = "Fail to sent email";
      let postbackData = JSON.stringify(tempOutputObj)
      res.status(400).send(`${postbackData}`);
    }
  } else {
    let text = `${req.body.image}:${req.body.tag} has been successfully updated`
    if (req.body.image === "atomportal") {
      let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.body.environment}-atomportal-api-${req.body.tag}`);
      checkOutput(output);
    } else {
      let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.body.environment}-${req.body.image.replace("_", "-")}-${req.body.tag}`);
      checkOutput(output);
    }
    tempOutputObj.message = text;
      let postbackData = JSON.stringify(tempOutputObj)
      res.status(200).send(`${postbackData}`);
  }
});

app.get("/api/v1/update/:deploymentName", (req, res) => {
  function checkOutput(output) {
    if (output.includes("restarted")) {
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        output,
        req.body
      );
      res.status(200).send(`${output}`);
    } else {
      writeErrorLogsToJsonFile(
        dataVariables[0].errorLogsID,
        output,
        req.body
      );
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        output
      );
      res.status(400).send(`${output}`);
    }
  }

  if (req.query.image.toLowerCase() === "atomportal") {
    let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.query.environment}-atomportal-api-${req.query.tag}`);
    checkOutput(output);
  } else {
    let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.query.environment}-${req.query.image}-${req.query.tag}`);
    checkOutput(output);
  }
});

app.post("/api/v1/sendApprovalEmail", (req, res) => {
  if (sendEmailToUpdate(req.body)) {
    res.status(200).send("Email Sent");
  } else {
    res.status(400).send("Fail to sent email");
  }
});

app.post("/api/v1/k8s/createDeploymentAndService", (req, res) => {
  console.log(req.body);
  let podDeploymentTemplate = JSON.parse(`{
    "apiVersion": "apps/v1",
    "kind": "Deployment",
    "metadata": {
      "name": "${req.body.environment}-${req.body.image}-${req.body.tag}",
      "labels": {
        "app": "${req.body.environment}-${req.body.image}-${req.body.tag}"
      }
    },
    "spec": {
      "replicas": ${req.body.replicas},
      "selector": {
        "matchLabels": {
          "app": "${req.body.environment}-${req.body.image}-${req.body.tag}"
        }
      },
      "strategy": {
        "rollingUpdate": {
          "maxSurge": 1,
          "maxUnavailable": 1
        }
      },
      "template": {
        "metadata": {
          "labels": {
            "app": "${req.body.environment}-${req.body.image}-${req.body.tag}"
          }
        },
        "spec": {
          "containers": [
            {
              "name": "${req.body.environment}-${req.body.image}-${req.body.tag}",
              "image": "atomdockerhub/${req.body.image}:${req.body.tag}",
              "imagePullPolicy": "Always",
              "ports": [
                {
                  "containerPort": 80
                }
              ]
            }
          ],
          "imagePullSecrets": [
            {
              "name": "regcred"
            }
          ]
        }
      }
    }
  }`);

  let podServiceTemplate = JSON.parse(`{
  "apiVersion": "v1",
  "kind": "Service",
  "metadata": {
    "name": "${req.body.environment}-${req.body.image}-${req.body.tag}-service"
  },
    "spec": {
      "type": "NodePort",
      "selector": {
        "app": "${req.body.environment}-${req.body.image}-${req.body.tag}"
      },
      "ports": [
        {
          "protocol": "TCP",
          "port": 5000,
          "targetPort": 80,
          "nodePort": ${req.body.nodePort}
        }
      ]
    }
  }`);
  const path = `../k8s_yaml/${req.body.environment}-${req.body.image}-${req.body.tag}.yaml`;
  let content = `${YAML.stringify(podDeploymentTemplate)}\n---\n${YAML.stringify(podServiceTemplate)}`

  if (fs.existsSync(path)) {
    console.log('file exists');
    res.status(400).send(`${req.body.environment}-${req.body.image}-${req.body.tag}.yaml file exists`);
  } else {
    let creatPodYAMLCLI = `touch ../k8s_yaml/${req.body.environment}-${req.body.image}-${req.body.tag}.yaml`;
    let output = shell.exec(creatPodYAMLCLI)
    fs.writeFile(path, content, err => {
      if (err) {
        console.error(err);
      } else {
        // let createdOutput = shell.exec(`microk8s kubectl apply -f ../k8s_yaml/${req.body.environment}-${req.body.image}-${req.body.tag}.yaml`);
        let createdOutput = "Reach create pod output"
        if (createdOutput.includes("created")) {
          res.status(201).send(createdOutput)
        } else {
          res.status(400).send(createdOutput);
        }
      }
      // file written successfully
    });



  }
});

app.post("/api/v1/k8s/createDeploymentAndServiceTest", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

async function sendEmailToUpdate(message) {
  try {
    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "172.20.0.50", // webmail.atom.com.au
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EmailUsername,
        pass: process.env.EmailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      //   from: '"Kube-Alert" <kube-alerts@atom.com.au>',
      // to: "InformationTechnology@atom.com.au",
      from: '"Kube-Alert" <noreply@atom.com.au>',
      to: "kube-alerts@atom.com.au",
      subject: `Waiting for update: ${message.environment
        }-${message.image.replace("_", "-")}-${message.tag}`,
      text: `Date & Time: ${date}/${month}/${year} ${hours}:${minutes}:${seconds} (${Intl.DateTimeFormat().resolvedOptions().timeZone
        })\nApplication: Microk8s Kubernetes Cluster\nWaiting for update: \nEnvironemnt: ${message.environment
        }\nImage: ${message.image}\nTag: ${message.tag
        }\n\nClick below link to update:\nhttps://kube-api-endpoint.atom.com.au/api/v1/update/deploymentName?environment=${message.environment
        }&image=${message.image.replace("_", "-")}&tag=${message.tag}`,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const port = process.env.PORT || 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));
