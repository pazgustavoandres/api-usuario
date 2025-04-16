require('dotenv').config();
const { Client } = require('pg');

console.log('Iniciando prueba de conexión a PostgreSQL...');
console.log('Versión de Node.js:', process.version);
console.log('Información de conexión:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);
console.log(`Puerto: 5432`);

// Método 1: Cliente básico con SSL
async function testBasicConnection() {
  console.log('\n== Método 1: Cliente básico con SSL ==');
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa');
    const res = await client.query('SELECT NOW() as time');
    console.log(`Fecha y hora del servidor: ${res.rows[0].time}`);
    await client.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Detalles:', e.stack);
  }
}

// Método 2: Sin SSL
async function testNoSSL() {
  console.log('\n== Método 2: Sin SSL ==');
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: false
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa');
    await client.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Detalles:', e.stack);
  }
}

// Método 3: SSL con más opciones
async function testAdvancedSSL() {
  console.log('\n== Método 3: SSL con más opciones ==');
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined
    },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa');
    await client.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Detalles:', e.stack);
  }
}

// Método 4: URI de conexión
async function testConnectionURI() {
  console.log('\n== Método 4: URI de conexión ==');
  const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?sslmode=require`;
  console.log(`URI: ${connectionString.replace(/:[^:]*@/, ':***@')}`);
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa');
    await client.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Detalles:', e.stack);
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  await testBasicConnection();
  await testNoSSL();
  await testAdvancedSSL();
  await testConnectionURI();
  console.log('\nPruebas completadas');
}

runAllTests().catch(e => {
  console.error('Error ejecutando pruebas:', e);
}); 