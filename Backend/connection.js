const mysql = require('mysql2');

pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ecommerce',
    port: 3309
  });

  module.exports = pool;