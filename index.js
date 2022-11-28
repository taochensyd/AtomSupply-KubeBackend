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
    Date: `${currentTimeStamp.getDate()}/${
      currentTimeStamp.getMonth() + 1
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
    Date: `${currentTimeStamp.getDate()}/${
      currentTimeStamp.getMonth() + 1
    }/${currentTimeStamp.getFullYear()}`,
    Message: logs,
    Parameter: arguements,
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
  let temp = shell.exec(cli)
  // for(let i=0; i<json.length; i++) {
    k8sPodsJSON.push(temp.stdout)
  // }
  console.log(k8sPodsJSON[0])
  res.status(200).json(k8sPodsJSON[0])
});

app.post("/update", (req, res) => {
  if (req.body.token !== BekkerToken) {
    res.status(401).send("Invalid token!");
  } else if (req.body.token === BekkerToken) {
    if (
      (req.body.image.toLowerCase() == "atomportal") &
      (req.body.tag.toLowerCase() == "develop") &
      (req.body.environment.toLowerCase() == "uat")
    ) {
      // shell.exec(
      //   "microk8s kubectl rollout restart deployment uat-develop-portal-api"
      // );
      shell.exec(`${dataScriptCLI[0].uatatomportaldevelop}`);
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
        req.body
      );
      // sendEmail().catch(console.error);
      res.json({
        kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
      }); // echo the result back
      //shell.exec('../ShellScript/updatePortalAPI.sh')
    } else if (
      (req.body.image.toLowerCase() == "atomportal_frontend") &
      (req.body.tag.toLowerCase() == "develop") &
      (req.body.environment.toLowerCase() == "uat")
    ) {
      // shell.exec(
      //   "microk8s kubectl rollout restart deployment uat-develop-portal-frontend"
      // );

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.res);
      //   }
      // });

      shell.exec(`${dataScriptCLI[0].uatatomportalfrontenddevelop}`);
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
        req.body
      );
      res.json({
        kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
      }); // echo the result back
    } else if (
      (req.body.image.toLowerCase() == "crmcard_ui") &
      (req.body.tag.toLowerCase() == "master") &
      (req.body.environment.toLowerCase() == "uat")
    ) {
      // shell.exec(
      //   "microk8s kubectl rollout restart deployment uat-master-crmcard-ui"
      // );

      shell.exec(`${dataScriptCLI[0].uatcrmcarduimaster}`);
      writeConsoleLogsToJsonFile(
        dataVariables[0].logsID,
        `kubeUpdate: ${req.body.image}:${req.body.tag} has been successfully updated`,
        req.body
      );
      res.json({
        kubeUpdate: `${req.body.image}:${req.body.tag} has been successfully updated`,
      }); // echo the result back
    } else {
      writeErrorLogsToJsonFile(
        dataVariables[0].errorLogsID,
        "Invalid Parameters",
        req.body
      );

      res.status(400).send("Invalid Parameters");
    }
  }
});

async function sendEmail() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "172.20.0.50", // webmail.atom.com.au
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "tchen",
      pass: "Mimashi123",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "tao.chen@atom.com.au",
    to: "taochensyd@gmail.com",
    subject: "automatic email from kube backend",
    text: "text body",
  });
}

const port = 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));
