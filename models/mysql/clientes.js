const { mysqlPool } = require('../../config/db');

const Clientes = {
  getAll: async () => {
    const [rows] = await mysqlPool.query(`
      SELECT *, 
      CONCAT(direccion, ', ', ciudad, ', ', pais) AS direccion_completa
      FROM clientes
      ORDER BY fecha_registro DESC
    `);
    return rows;
  },

  search: async (term) => {
    const [rows] = await mysqlPool.query(
      `SELECT id, nombre, email 
       FROM clientes 
       WHERE nombre LIKE ? OR email LIKE ?`,
      [`%${term}%`, `%${term}%`]
    );
    return rows;
  }
};

module.exports = Clientes;