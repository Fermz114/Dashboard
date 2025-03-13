const express = require('express');
const router = express.Router();
const Clientes = require('../models/mysql/clientes');

// Cache con actualización cada 10 minutos
let cacheClientes = [];
let ultimaActualizacion = null;

router.get('/', async (req, res) => {
  try {
    // Actualizar cache si es necesario
    if (!ultimaActualizacion || Date.now() - ultimaActualizacion > 600000) {
      cacheClientes = await Clientes.getAll();
      ultimaActualizacion = Date.now();
    }

    res.render('clientes', {
      title: 'Gestión de Clientes',
      clientes: cacheClientes,
      helpers: {
        formatoTelefono: (num) => {
          const numStr = num.toString();
          return numStr.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
      }
    });

  } catch (err) {
    console.error(`Error GET /clientes [${new Date().toISOString()}]:`, err);
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'Error al cargar clientes',
      detalle: process.env.NODE_ENV === 'development' ? err.stack : ''
    });
  }
});

// Búsqueda en tiempo real
router.get('/buscar', async (req, res) => {
  try {
    const { termino } = req.query;
    const resultados = await Clientes.search(termino);
    res.json(resultados);
  } catch (err) {
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

module.exports = router;