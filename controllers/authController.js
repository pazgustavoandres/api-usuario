const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Función para obtener la conexión a la BD
const getDbConnection = () => {
  // Si tenemos la conexión global (después de conectarse), usarla
  if (global.dbPool) {
    return global.dbPool;
  } 
  // Si no, intentar importar directamente (para compatibilidad)
  return require("../config/db");
};

// Función para verificar si la BD está disponible
const isDatabaseAvailable = async () => {
  try {
    const db = getDbConnection();
    // Intenta hacer una consulta simple
    await db.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Error verificando disponibilidad de BD:', error.message);
    return false;
  }
};

exports.register = async (req, res) => {
  // Primero verificamos si la BD está disponible
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ 
      error: "Servicio no disponible", 
      message: "Base de datos temporalmente no disponible. Intente más tarde." 
    });
  }

  const { email, password } = req.body;
  try {
    const db = getDbConnection();
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashed,
    ]);
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  // Primero verificamos si la BD está disponible
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ 
      error: "Servicio no disponible", 
      message: "Base de datos temporalmente no disponible. Intente más tarde." 
    });
  }

  const { email, password } = req.body;
  try {
    const db = getDbConnection();
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  // Primero verificamos si la BD está disponible
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return res.status(503).json({ 
      error: "Servicio no disponible", 
      message: "Base de datos temporalmente no disponible. Intente más tarde." 
    });
  }

  try {
    const db = getDbConnection();
    const result = await db.query("SELECT id, email FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.welcome = (req, res) => {
  res.json({
    message: "Bienvenido a la API de Usuarios 🎉",
    endpoints: {
      register: "/api/register",
      login: "/api/login",
      users: "/api/users"
    },
    status: "online"
  });
};
