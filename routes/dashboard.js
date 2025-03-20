// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/db');
const Game = require('../models/mongo/game');
const { formatCurrency, formatDate } = require('../helpers/utils');



// Dashboard principal (ÚNICA RUTA PARA EL DASHBOARD)
router.get('/', async (req, res) => {
    try {
      const [allGames, stats, latestGames, inventoryAlerts] = await Promise.all([
        // Todos los juegos para el dropdown
        Game.find().lean(),
        
        // Estadísticas desde MySQL
        mysqlPool.query(`
          SELECT 
            COUNT(*) AS total_items,
            SUM(stock) AS total_stock,
            COUNT(DISTINCT mongo_game_id) AS unique_games
          FROM inventario_fisico
        `),
        
        // Últimos 5 juegos añadidos
        Game.find().sort({ createdAt: -1 }).limit(5).lean(),
        
        // Alertas de inventario
        (async () => {
          const [inventario] = await mysqlPool.query(`
            SELECT * 
            FROM inventario_fisico 
            WHERE stock < 5
            ORDER BY stock ASC 
            LIMIT 5
          `);
          
          const gameIds = inventario.map(item => item.mongo_game_id);
          const games = await Game.find({ _id: { $in: gameIds } }).lean();
          
          return inventario.map(item => ({
            ...item,
            gameInfo: games.find(g => g._id.toString() === item.mongo_game_id)
          }));
        })()
      ]);
  
      const formattedStats = {
        totalItems: stats[0][0].total_items,
        totalStock: stats[0][0].total_stock,
        uniqueGames: stats[0][0].unique_games,
        lowStockItems: inventoryAlerts.length
      };
  
      res.render('dashboard', {
        title: 'Panel de Control',
        stats: formattedStats,
        latestGames,
        inventoryAlerts,
        games: allGames, // <-- Variable clave para el dropdown
        helpers: { formatCurrency, formatDate }
      });
      
    } catch (error) {
      console.error('Error en dashboard:', error);
      res.status(500).render('500', {
        title: 'Error',
        mensaje: 'Error al cargar el dashboard',
        detalle: process.env.NODE_ENV === 'development' ? error.stack : ''
      });
    }
  });

// Vista de inventario completo
router.get('/inventario', async (req, res) => {
  try {
    const [inventario] = await mysqlPool.query(`
      SELECT * FROM inventario_fisico ORDER BY stock ASC
    `);
    
    const gameIds = inventario.map(item => item.mongo_game_id);
    const games = await Game.find({ _id: { $in: gameIds } }).lean();
    
    const inventoryData = inventario.map(item => ({
      ...item,
      gameInfo: games.find(g => g._id.toString() === item.mongo_game_id)
    }));

    res.render('inventario', {
      title: 'Inventario Completo',
      inventory: inventoryData,
      helpers: { formatCurrency }
    });
    
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'Error al cargar inventario'
    });
  }
});

// Actualización de stock (AJAX)
router.put('/inventario/:id', async (req, res) => {
  try {
    const { cantidad } = req.body;
    
    await mysqlPool.query(
      'UPDATE inventario_fisico SET stock = ? WHERE id = ?',
      [cantidad, req.params.id]
    );

    res.json({ 
      success: true,
      newStock: cantidad
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error actualizando stock'
    });
  }
});

module.exports = router;