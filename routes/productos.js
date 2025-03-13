const express = require('express');
const router = express.Router();
const Producto = require('../models/mongo/productos');

// Cache simple para mejor performance
let cacheProductos = [];
let ultimaActualizacion = null;

router.get('/', async (req, res) => {
  try {
    // Recargar datos cada 5 minutos
    if (!ultimaActualizacion || Date.now() - ultimaActualizacion > 300000) {
      cacheProductos = await Producto.find().lean();
      ultimaActualizacion = Date.now();
    }
    
    res.render('productos', {
      title: 'Gestión de Productos',
      productos: cacheProductos,
      helpers: {
        formatoMoneda: (valor) => `$${parseFloat(valor).toFixed(2)}`
      }
    });
    
  } catch (err) {
    console.error(`Error GET /productos [${new Date().toISOString()}]:`, err);
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'Error al cargar los productos',
      detalle: process.env.NODE_ENV === 'development' ? err.stack : ''
    });
  }
});

module.exports = router;