const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123",
  database: process.env.DB_NAME || "project_petra",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" Connected to MySQL database");
    connection.release();
  } catch (err) {
    console.error(" Database connection failed:", err.message);
  }
})();

module.exports = pool;