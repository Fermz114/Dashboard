const express = require('express');
const router = express.Router();
const Ventas = require('../models/mysql/ventas');

// Cache de ventas
let cacheVentas = [];
let ultimaActualizacion = null;

router.get('/', async (req, res) => {
  try {
    // Actualizar cache cada 3 minutos
    if (!ultimaActualizacion || Date.now() - ultimaActualizacion > 180000) {
      cacheVentas = await Ventas.getAll();
      ultimaActualizacion = Date.now();
    }

    res.render('ventas', {
      title: 'Reporte de Ventas',
      ventas: cacheVentas,
      helpers: {
        formatoFecha: (fecha) => new Date(fecha).toLocaleDateString('es-MX'),
        formatoMoneda: (monto) => `$${parseFloat(monto).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
      }
    });

  } catch (err) {
    console.error(`Error GET /ventas [${new Date().toISOString()}]:`, err);
    res.status(500).render('500', {
      title: 'Error',
      mensaje: 'Error al cargar ventas',
      detalle: process.env.NODE_ENV === 'development' ? err.stack : ''
    });
  }
});

module.exports = router;