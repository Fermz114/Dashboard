const mongoose = require('mongoose');
const mysql = require('mysql2');
require('dotenv').config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error en MongoDB:', err));

// Conexión a MySQL (usando pool)
const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // <-- Agregar .promise() para async/await

// Verificación MongoDB Atlas
mongoose.connection.on('connected', () => {
    console.log('🟢 MongoDB conectado a:', mongoose.connection.host);
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('🔴 Error MongoDB:', err.message);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('⚪ MongoDB desconectado');
  });

// Verificación de conexión MySQL
mysqlPool.getConnection()
    .then((conn) => {
        console.log('✅ MySQL conectado');
        conn.release();
    })
    .catch(err => console.error('❌ Error en MySQL:', err));

// Exportar conexiones
module.exports = { mongoose, mysqlPool }; // <-- Nombre corregido