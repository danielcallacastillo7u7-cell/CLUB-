const mysql = require('mysql2/promise');
require('dotenv').config(); // Esto tiene que estar SI O SI aquí

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',      // Si falla el .env, usará 'root'
    password: process.env.DB_PASSWORD || '',   // Si falla el .env, usará vacío
    database: process.env.DB_NAME || 'club_catarindo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión inmediata
pool.getConnection()
    .then(conn => {
        console.log("✅ Conexión a MySQL exitosa desde db.js");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Error en db.js:", err.message);
    });

module.exports = pool;