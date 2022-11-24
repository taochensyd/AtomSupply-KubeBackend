const express = require("express");
const router = express.Router();
const { kubemanagement } = require("../controllers/kubemanagement");

router.route("/").post(kubemanagement);
module.exports = router;
