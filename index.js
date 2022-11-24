const express = require("express");
const app = express();
const update = require("./routes/update");
const kubemanagement = require("./routes/kubemanagement");
require('dotenv').config()

//middleware
app.use(express.json());

//route
app.get("/hello", (req, res) => {
  res.send("NodeJS+Express");
});

app.use("/update", update);
app.use("/api/v1/kubemanagement", kubemanagement);

const port = 3500;

app.listen(port, console.log(`Server is listening on port ${port}`));