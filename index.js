const express = require("express");
const app = express();
const lineReader = require("line-reader");
const update = require("./routes/update");
const fs = require('fs');
require("dotenv").config();

//middleware
app.use(express.json());

//route
app.get("/hello", (req, res) => {
  res.send("NodeJS+Express");
});

app.get("/api/v1/getOutLog", (req, res) => {
  
  fs.readFile('logs/index-out.log', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.get("/api/v1/getErrorLog", (req, res) => {
  
  fs.readFile('logs/index-error.log', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.use("/update", update);
// app.use("/api/v1/kubemanagement", kubemanagement);
// app.use("/api/v1/getLogs", getLogs);



const port = 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));
