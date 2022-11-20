const express = require("express");
const router = express.Router();
const {
    updateContainers
} = require("../controllers/update");

router.route("/").post(updateContainers)

module.exports = router;