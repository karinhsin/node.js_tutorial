//載入連線設定
//一般只會連一個資料庫
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.query(
    "SELECT * FROM address_book LIMIT 2,3",
    (error, r) => {
        console.log(r);
        process.exit();
    });