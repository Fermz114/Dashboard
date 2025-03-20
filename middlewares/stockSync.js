const { mongoose } = require('../models/mongo/game');
const InventarioMySQL = require('../models/mysql/inventario');

const syncStockToMongo = async (mongoGameId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Obtener stock físico actual desde MySQL
    const stockFisico = await InventarioMySQL.getStockFisico(mongoGameId);
    
    // 2. Actualizar MongoDB
    await mongoose.model('Game').updateOne(
      { _id: mongoGameId },
      { $set: { 'stock.fisico': stockFisico } },
      { session }
    );
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { syncStockToMongo };