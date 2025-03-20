require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const { mysqlPool } = require('./config/db'); 
const expressLayouts = require('express-ejs-layouts');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // Usa views/layout.ejs


// Conexiones a Bases de Datos (MongoDB ya se conecta desde db.js)
// Verificación de conexión MySQL (actualizado)
mysqlPool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL listo');
    conn.release(); // ¡Importante liberar la conexión!
  })
  .catch(err => console.error('❌ Error MySQL:', err));

  // Configuración de sesión
const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  schema: {
      tableName: 'sessions',
      columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
      }
  }
}, mysqlPool);

app.use(session({
  key: 'session_cookie',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
      maxAge: 86400000,
      httpOnly: true
  }
}));

// Rutas
const indexRouter = require('./routes/index');
const ventasRouter = require('./routes/ventas');
const productosRouter = require('./routes/productos');
const clientesRouter = require('./routes/clientes');
const inventarioRoutes = require('./routes/inventario'); // Rutas API
const dashboardRoutes = require('./routes/dashboard'); // Nombre correcto
const authRoutes = require('./routes/auth');
const clienteRoutes = require('./routes/cliente');
const vendedorRoutes = require('./routes/vendedor');
const gerenteRoutes = require('./routes/gerente');


app.use('/', indexRouter);
app.use('/dashboard', dashboardRoutes);
app.use('/ventas', ventasRouter);
app.use('/productos', productosRouter);
app.use('/clientes', clientesRouter);
app.use('/inventario', inventarioRoutes); // Rutas API

app.use('/', authRoutes);
app.use('/cliente', require('./middlewares/auth').hasRole('cliente'), clienteRoutes);
app.use('/vendedor', require('./middlewares/auth').hasRole('vendedor'), vendedorRoutes);
app.use('/gerente', require('./middlewares/auth').hasRole('gerente'), gerenteRoutes);


// Manejo de errores
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Error interno' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

// Cierre limpio al terminar el proceso
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    await mysqlPool.end(); // <-- Usar el nuevo nombre
});