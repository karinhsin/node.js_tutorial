//連線模組
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true, connectionLimit: 5, // 最大連線數（通常1.2個）
    queryLimit:0 //排隊限制
});

module.exports = pool.promise(); //匯出 promise pool