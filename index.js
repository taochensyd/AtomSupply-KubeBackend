const express = require("express");
const app = express();
const update = require("./routes/update");
const fs = require("fs");
const nodemailer = require('nodemailer');
require('dotenv').config()

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

app.get('.api/v1/home/logs', (req, res) => {
  
})

app.use("/update", update);
// app.use("/api/v1/kubemanagement", kubemanagement);
// app.use("/api/v1/getLogs", getLogs);



//Email Section



//End Email Section






const port = 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));
