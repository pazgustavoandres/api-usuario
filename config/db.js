const { Pool } = require("pg");
require("dotenv").config();

// Configuración de entorno
const isProduction = process.env.NODE_ENV === 'production';
console.log("Entorno:", isProduction ? "Producción" : "Desarrollo");
console.log("Intentando conectar a:", process.env.DB_HOST);

// Usar URI de conexión en lugar de objeto de configuración
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`;
console.log(`URI: ${connectionString.replace(/:[^:]*@/, ':***@')}`);

const poolConfig = {
  connectionString,
  ssl: { 
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined // Deshabilita la verificación de identidad del servidor 
  },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: true,
  max: 5 // Limitar el número máximo de conexiones
};

console.log("Configuración de conexión:", { ...poolConfig, ssl: { ...poolConfig.ssl } });

let retries = 0;
const MAX_RETRIES = 3;

function connectWithRetry() {
  const pool = new Pool(poolConfig);
  
  // Manejo de errores inesperados
  pool.on('error', (err) => {
    console.error("Error inesperado en el cliente PostgreSQL", err);
    console.error("Detalles del error:", err.stack);
  });
  
  console.log(`Intento de conexión #${retries + 1}`);
  
  return pool.connect()
    .then((client) => {
      console.log("✅ Conectado a la base de datos");
      // Realizar una consulta de prueba
      return client.query('SELECT NOW() as time')
        .then(res => {
          console.log(`Fecha y hora del servidor: ${res.rows[0].time}`);
          client.release();
          return pool;
        })
        .catch(err => {
          client.release();
          throw err;
        });
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
        
        // No terminar el proceso, solo devolver un pool no conectado
        // para que la aplicación pueda seguir funcionando
        console.warn("Continuando sin conexión a base de datos");
        return pool;
      }
    });
}

// Exportamos la función para conectar con reintento
module.exports = connectWithRetry();