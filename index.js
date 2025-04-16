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

// Ruta básica para verificar el estado del servidor
app.get('/', (req, res) => {
  res.json({ status: 'API funcionando correctamente', environment: isProduction ? 'production' : 'development' });
});

app.use("/api", authRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: isProduction ? null : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
