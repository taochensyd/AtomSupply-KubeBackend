const nodemailer = require("nodemailer");
const shell = require("shelljs");
require('dotenv').config();


module.exports = async function sendEmailLink(message) {
    let currentTimeStamp = shell.exec("date");
    try {


        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: process.env.emailHost, // webmail.atom.com.au
            port: process.env.emailPort,
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
            text: `Timestamp: ${currentTimeStamp}\nApplication: Microk8s Kubernetes Cluster\nWaiting for update: \nEnvironemnt: ${message.environment
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