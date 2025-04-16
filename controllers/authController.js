const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
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
  const { email, password } = req.body;
  try {
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
  try {
    const result = await db.query("SELECT id, email FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.welcome = (req, res) => {
  res.send("Bienvenido a la API 🎉");
};
