// models/mysql/Ventas.js
const { mysqlPool } = require('../../config/db');

const Ventas = {
  getAll: async () => {
    const [rows] = await mysqlPool.query('SELECT * FROM ventas'); // <-- Sin .then()
    return rows;
  }
};

module.exports = Ventas;