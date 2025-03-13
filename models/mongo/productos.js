const mongoose = require('mongoose');
const Decimal128 = mongoose.Schema.Types.Decimal128;

const productoSchema = new mongoose.Schema({
  Nombre: {
    type: String,
    required: true
  },
  Precio: {
    type: Decimal128,
    required: true
  },
  Categoria: {
    type: String,
    required: true
  },
  Stock: {
    type: Number,
    default: 0,
    min: 0
  }
},{ collection: 'Productos' });

module.exports = mongoose.model('Producto', productoSchema);