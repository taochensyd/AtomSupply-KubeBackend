const express = require("express");
const router = express.Router();
const { update } = require("../controllers/update");

router.route("/").post(update);

module.exports = router;
