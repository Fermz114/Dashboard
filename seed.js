const mongoose = require('mongoose');
const { mysqlPool } = require('./config/db');
const Game = require('./models/mongo/game');

const seedGames = async () => {
  try {
    // MongoDB
    const cyberpunk = await Game.create({
      titulo: "Cyberpunk 2077",
      plataformas: ["PC", "PS5"],
      requisitosPC: {
        os: "Windows 10",
        procesador: "Intel Core i7-6700",
        ram: "16GB",
        gpu: "NVIDIA GeForce GTX 1060",
        almacenamiento: "70GB"
      },
      metadatos: {
        metacritic: 86,
        lanzamiento: new Date("2020-12-10"),
        desarrollador: "CD Projekt Red"
      }
    });

    // Convertir ObjectId a string antes de insertarlo en MySQL
    const mongoGameId = cyberpunk._id.toString();

    // MySQL
    await mysqlPool.query(
      'INSERT INTO inventario_fisico (mongo_game_id, stock, ubicacion) VALUES (?, ?, ?)',
      [mongoGameId, 15, 'Estante A1']
    );

    console.log('✅ Datos iniciales creados');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    process.exit();
  }
};

seedGames();
