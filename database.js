const mysql = require('mysql2');
require('dotenv').config();


module.exports = mysql.createConnection({
    host: process.env.MySQL_DB_HOST,
    user: process.env.MySQL_DB_Username,
    password: process.env.MySQL_DB_Password,
    database: process.env.MySQL_DB_Name
})