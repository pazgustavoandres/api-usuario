require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

// Configuración de entorno
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Iniciando servidor en modo: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`Variables de entorno cargadas: DB_HOST=${!!process.env.DB_HOST}, DB_USER=${!!process.env.DB_USER}, DB_NAME=${!!process.env.DB_NAME}`);

const app = express();

// Middleware para registro de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Variable global para el estado de la conexión
let dbConnected = false;

// Configuramos las rutas directamente en la raíz - IMPORTANTE PARA FRONTEND
app.use("/", authRoutes);

// Ruta básica para verificar el estado del servidor
app.get('/status', (req, res) => {
  res.json({ 
    status: 'API funcionando correctamente', 
    environment: isProduction ? 'production' : 'development',
    dbConnected: dbConnected,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor sin esperar a la conexión de la base de datos
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Conectar a la base de datos de forma asíncrona
console.log("Intentando conectar a la base de datos...");
const dbConnect = require("./config/db");

// Manejar la conexión a la BD de forma asíncrona
dbConnect
  .then(pool => {
    console.log("Conexión a BD establecida correctamente en index.js");
    dbConnected = true;
    // Exportar el pool para que los controladores lo utilicen
    global.dbPool = pool;
  })
  .catch(err => {
    console.error("Error al configurar conexión a BD:", err);
    // No cerramos el servidor para mantener la aplicación funcionando
  });

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: isProduction ? null : err.message
  });
});

// Gestión de cierre limpio
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
  });
});
