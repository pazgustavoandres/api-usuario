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
  ssl: {
    rejectUnauthorized: false,
  },
  allowExitOnIdle: true,
  connectionTimeoutMillis: 10000, // 10 segundos para timeout
  idleTimeoutMillis: 30000, // 30 segundos para timeout en idle
};

console.log("Intentando conexión con configuración:", { ...connectionConfig, password: '***' });

// Intento con error mejorado
let retries = 0;
const MAX_RETRIES = 3;

function connectWithRetry() {
  const pool = new Pool(connectionConfig);
  
  // Manejo de errores inesperados
  pool.on('error', (err) => {
    console.error("Error inesperado en el cliente PostgreSQL", err);
    console.error("Detalles del error:", err.stack);
  });
  
  console.log(`Intento de conexión #${retries + 1}`);
  
  return pool.connect()
    .then((client) => {
      console.log("✅ Conectado a la base de datos");
      client.release();
      return pool;
    })
    .catch((err) => {
      console.error(`❌ Error en intento #${retries + 1}:`, err.message);
      console.error("Detalles del error:", err.stack);
      
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Reintentando conexión en 3 segundos...`);
        return new Promise(resolve => setTimeout(() => resolve(connectWithRetry()), 3000));
      } else {
        console.error("Se agotaron los intentos de conexión a la base de datos");
        process.exit(1);
      }
    });
}

// Exportamos la función para conectar con reintento
module.exports = connectWithRetry();