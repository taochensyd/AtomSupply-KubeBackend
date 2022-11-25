const express = require("express");
const app = express();
const lineReader = require("line-reader");
const update = require("./routes/update");
const fs = require("fs");
<<<<<<< HEAD
require("dotenv").config();
=======
const nodemailer = require('nodemailer');
require('dotenv').config()
>>>>>>> d363c8e (add email respond)

//middleware
app.use(express.json());

//route
app.get("/", (req, res) => {
  res.sendFile('views/index.html', {root: __dirname })
});

app.get("/hello", (req, res) => {
  res.send("NodeJS+Express");
});

app.get("/api/v1/getOutLog", (req, res) => {
<<<<<<< HEAD
  fs.readFile("logs/index-out.log", "utf8", (err, data) => {
=======
  fs.readFile("../.pm2/logs/index-out.log", "utf8", (err, data) => {
>>>>>>> d363c8e (add email respond)
    if (err) {
      console.error(err);
      return;
    }
<<<<<<< HEAD
=======
    // sendFile('views/logs.html', {root: __dirname })
>>>>>>> d363c8e (add email respond)
    res.send(data);
  });
});

app.get("/api/v1/getErrorLog", (req, res) => {
<<<<<<< HEAD
  fs.readFile("logs/index-error.log", "utf8", (err, data) => {
=======
  fs.readFile("../.pm2/logs/index-error.log", "utf8", (err, data) => {
>>>>>>> d363c8e (add email respond)
    if (err) {
      console.error(err);
      return;
    }
<<<<<<< HEAD
=======
    // sendFile('views/logs.html', {root: __dirname })
>>>>>>> d363c8e (add email respond)
    res.send(data);
  });
});

app.use("/update", update);
// app.use("/api/v1/kubemanagement", kubemanagement);
// app.use("/api/v1/getLogs", getLogs);

<<<<<<< HEAD
=======


//Email Section



//End Email Section






>>>>>>> d363c8e (add email respond)
const port = 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));
