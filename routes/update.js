const express = require("express");
const router = express.Router();
const shell = require("shelljs");
const db = require('../database');
const sendEmailLink = require('./email');



router.post("/", (req, res) => {
    let currentTimeStamp = shell.exec("date");
    let tempOutputObj = {
        Date: currentTimeStamp,
        message: ""
    }

    if (req.body.token !== BekkerToken) {

        res.status(401).send("Invalid token!");

    } else if (req.body.environment === "uat" && req.body.tag === "staging") {

        if (sendEmailLink(req.body)) {
            tempOutputObj.message = "Email Sent";
            let postbackData = JSON.stringify(tempOutputObj)
            res.status(200).send(`${postbackData}`);
        } else {
            tempOutputObj.message = "Fail to sent email";
            let postbackData = JSON.stringify(tempOutputObj)
            res.status(400).send(`${postbackData}`);
        }

    } else {

        // let text = `${req.body.image}:${req.body.tag} has been successfully updated`
        if (req.body.image === "atomportal") {
            let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.body.environment}-atomportal-api-${req.body.tag}`);
            if (output.includes("restarted")) {
                try {
                    let sql = `INSERT INTO KubeUpdateLogs (UpdateTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "atomportal - api", "${req.body.tag}", "${output}");`;
                    db.query(sql, (err, rows) => {
                        console.log(rows);
                    });
                } catch (error) {
                    console.log(error);
                }

                let postbackData = JSON.stringify(tempOutputObj)
                res.status(200).send(`${postbackData}`);
            } else {
                try {
                    let sql = `INSERT INTO KubeUpdateErrorLogs (ErrorTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "atomportal - api", "${req.body.tag}", "${output}");`;
                    db.query(sql, (err, rows) => {
                        console.log(rows);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.body.environment}-${req.body.image.replace("_", "-")}-${req.body.tag}`);
            if (output.includes("restarted")) {
                try {
                    let sql = `INSERT INTO KubeUpdateLogs (UpdateTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "${req.body.image.replace("_", "-")}", "${req.body.tag}", "${output}");`;
                    db.query(sql, (err, rows) => {
                        console.log(rows);
                    });
                } catch (error) {
                    console.log(error);
                }
                let postbackData = JSON.stringify(tempOutputObj)
                res.status(200).send(`${postbackData}`);
            } else {
                try {
                    let sql = `INSERT INTO KubeUpdateErrorLogs (ErrorTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "${req.body.image.replace("_", "-")}", "${req.body.tag}", "${output}");`;
                    db.query(sql, (err, rows) => {
                        console.log(rows);
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
})





router.get("/:deploymentName", (req, res) => {
    if (req.query.image.toLowerCase() === "atomportal") {
        let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.query.environment}-atomportal-api-${req.query.tag}`);
        if (output.includes("restarted")) {
            try {
                let sql = `INSERT INTO KubeUpdateLogs (UpdateTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "atomportal - api", "${req.body.tag}", "${output}");`;
                db.query(sql, (err, rows) => {
                    console.log(rows);
                });
            } catch (error) {
                console.log(error);
            }

            let postbackData = JSON.stringify(tempOutputObj)
            res.status(200).send(`${postbackData}`);
        } else {
            try {
                let sql = `INSERT INTO KubeUpdateErrorLogs (ErrorTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "atomportal - api", "${req.body.tag}", "${output}");`;
                db.query(sql, (err, rows) => {
                    console.log(rows);
                });
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        let output = shell.exec(`microk8s kubectl rollout restart deployment ${req.query.environment}-${req.query.image}-${req.query.tag}`);
        if (output.includes("restarted")) {
            try {
                let sql = `INSERT INTO KubeUpdateLogs (UpdateTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "${req.body.image.replace("_", "-")}", "${req.body.tag}", "${output}");`;
                db.query(sql, (err, rows) => {
                    console.log(rows);
                });
            } catch (error) {
                console.log(error);
            }
            let postbackData = JSON.stringify(tempOutputObj)
            res.status(200).send(`${postbackData}`);
        } else {
            try {
                let sql = `INSERT INTO KubeUpdateErrorLogs (ErrorTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "${req.body.image.replace("_", "-")}", "${req.body.tag}", "${output}");`;
                db.query(sql, (err, rows) => {
                    console.log(rows);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
});




module.exports = router;
