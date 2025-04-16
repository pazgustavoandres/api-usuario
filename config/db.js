const { Pool } = require("pg");
require("dotenv").config();

// Configuración más robusta para entornos de producción
const isProduction = process.env.NODE_ENV === 'production';
console.log("Entorno:", isProduction ? "Producción" : "Desarrollo");
console.log("Intentando conectar a:", process.env.DB_HOST);

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: true,
  allowExitOnIdle: true,
  connectionTimeoutMillis: 10000, // 10 segundos para timeout
  idleTimeoutMillis: 30000, // 30 segundos para timeout en idle
};

const pool = new Pool(connectionConfig);

// Manejo de errores inesperados
pool.on('error', (err) => {
  console.error("Error inesperado en el cliente PostgreSQL", err);
  console.error("Detalles del error:", err.stack);
  process.exit(-1);
});

// Intento de conexión con mejor manejo de errores
pool
  .connect()
  .then(() => console.log("✅ Conectado a la base de datos"))
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err.message);
    console.error("Detalles del error:", err.stack);
    console.error("Configuración (sin contraseña):", { ...connectionConfig, password: '***' });
    process.exit(1);
  });
  
module.exports = pool;