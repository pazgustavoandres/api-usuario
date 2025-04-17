const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  welcome,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Usando la ruta / para welcome
router.get("/", welcome);

// Estas rutas son ahora directamente accesibles desde la raíz
router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getAllUsers);

module.exports = router;
