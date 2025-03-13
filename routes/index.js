const express = require('express');
const router = express.Router();
const Producto = require('../models/mongo/productos');
const { mysqlPool } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [productos, ventas, clientes] = await Promise.all([
      Producto.countDocuments(),
      mysqlPool.query('SELECT SUM(total) AS total FROM ventas')
        .then(([[{ total }]]) => total || 0),
      mysqlPool.query('SELECT COUNT(*) AS total FROM clientes')
        .then(([[{ total }]]) => total)
    ]);

    res.render('index', {
      title: 'Dashboard Principal',
      stats: {
        productos,
        ventas,
        clientes
      }
    });

  } catch (err) {
    console.error('Error en dashboard:', err);
    res.render('index', {
      title: 'Dashboard',
      stats: {
        productos: 0,
        ventas: 0,
        clientes: 0
      }
    });
  }
});

module.exports = router;