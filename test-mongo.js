require('dotenv').config();
const { mongoose } = require('./config/db');

const testConnection = async () => {
  try {
    // Esperar conexión explícitamente
    await mongoose.connection.asPromise();
    
    console.log('🟢 Estado conexión:', mongoose.connection.readyState);
    
    // Verificación moderna
    const admin = mongoose.connection.getClient().db().admin();
    const ping = await admin.ping();
    console.log('✅ Ping MongoDB:', ping);

    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Colecciones:', collections.map(c => c.name));

    // Agrega esto después de listar colecciones
const Producto = require('./models/mongo/productos');
const resultado = await Producto.findOne();
console.log('Producto de prueba:', resultado);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('⚪ Desconectado');
  }
};

testConnection();