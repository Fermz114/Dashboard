const express = require('express');
const router = express.Router();
const Game = require('../models/mongo/game'); // Asegúrate de la ruta correcta

router.get('/', async (req, res) => {
    try {
        const games = await Game.find().lean(); // Obtener todos los juegos
        res.render('gerente/dashboard', {
            title: 'Dashboard Gerente',
            user: req.session.user,
            games: games // Pasar los juegos a la vista
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el dashboard');
    }
});

module.exports = router;