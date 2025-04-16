require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
