require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

async function testConnection() {
    try {
        const [rows, fields] = await pool.query('SELECT 1 + 1 AS result');
        console.log('MySQL Connection Success:', rows[0].result);
    } catch ( err ) {
        console.error('MySQL Connection Failed:', err.message);
    }
}
testConnection();

module.exports = pool;
