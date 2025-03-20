const { mysqlPool } = require('../../config/db');

module.exports = {
  getStockFisico: async (gameId) => {
    const [rows] = await mysqlPool.query(
      'SELECT stock FROM inventario_fisico WHERE mongo_game_id = ?',
      [gameId]
    );
    return rows[0]?.stock || 0;
  },

  actualizarStockFisico: async (gameId, cantidad) => {
    await mysqlPool.query(
      'UPDATE inventario_fisico SET stock = stock + ? WHERE mongo_game_id = ?',
      [cantidad, gameId]
    );
  }
}; 