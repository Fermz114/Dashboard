const mongoose = require('mongoose');

const requisitosPCSchema = new mongoose.Schema({
  os: { type: String, required: true },
  procesador: { type: String, required: true },
  ram: { type: String, required: true },
  gpu: { type: String, required: true },
  almacenamiento: { type: String, required: true }
});

const gameSchema = new mongoose.Schema({
  titulo: { type: String, required: true, unique: true },
  plataformas: { type: [String], enum: ['PC', 'PS5', 'Xbox Series X', 'Switch'], required: true },
  requisitosPC: requisitosPCSchema,
  metadatos: {
    metacritic: { type: Number, min: 0, max: 100 },
    lanzamiento: Date,
    desarrollador: String
  },
  stock: {
    digital: { type: Boolean, default: true }, // Siempre disponible
    fisico: { type: Number, default: 0 } // Sincronizado desde MySQL
  }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);    // <-- Exportar modelo de juego para usar en otros archivos