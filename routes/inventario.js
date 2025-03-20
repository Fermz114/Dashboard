const express = require('express');
const router = express.Router();
const Game = require('../models/mongo/game');
const InventarioMySQL = require('../models/mysql/inventario');
const { syncStockToMongo } = require('../middlewares/stockSync');

// Obtener estado completo de un juego
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).lean();
    
    if (!game) return res.status(404).json({ error: 'Juego no encontrado' });
    
    // Mezclar datos de MongoDB y MySQL
    const stockFisicoDetalle = await InventarioMySQL.getStockFisico(req.params.id);
    const response = {
      ...game,
      stockFisicoDetalle
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar stock físico
router.put('/:id/stock', async (req, res) => {
  try {
    // 1. Actualizar MySQL
    await InventarioMySQL.actualizarStockFisico(
      req.params.id,
      req.body.cantidad
    );
    
    // 2. Sincronizar MongoDB
    await syncStockToMongo(req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;