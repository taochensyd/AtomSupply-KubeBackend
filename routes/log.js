const express = require("express");
const router = express.Router();
const db = require('../database');

router.get('/updateLog', (req, res) => {
    try {
        let sql = `SELECT * FROM KubeUpdateLogs`;
        db.query(sql, (err, rows) => {
            res.send(rows);
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/errorLog', (req, res) => {
    try {
        let sql = `SELECT * FROM KubeUpdateErrorLogs`;
        db.query(sql, (err, rows) => {
            res.send(rows);
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;