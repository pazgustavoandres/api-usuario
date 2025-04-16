const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  allowExitOnIdle: true,
});

// Manejo de errores inesperados
pool.on('error', (err) => {
  console.error("Error inesperado en el cliente PostgreSQL", err);
  process.exit(-1);
});

pool
  .connect()
  .then(() => console.log("✅ Conectado a la base de datos"))
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err.message);
    process.exit(1);
  });
module.exports = pool;