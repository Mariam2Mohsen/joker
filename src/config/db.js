const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
});


const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("🚀 [Database] Connected successfully to CPanel MySQL!");
    console.log("📍 Connected to Host:", process.env.DB_HOST);
    console.log("📂 Database Name:", process.env.DB_NAME);
    connection.release(); 
  } catch (err) {
    console.error("❌ [Database] Connection failed!");
    console.error("🔍 Error Detail:", err.message);
    

    if (err.message.includes('ETIMEDOUT')) {
      console.log("💡 Hint: Check 'Remote MySQL' in CPanel and add your IP.");
    }
  }
};

testConnection();

module.exports = pool;