const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lcl_alihost_2019070270',
  database: 'xd_course',
});

module.exports = db;

