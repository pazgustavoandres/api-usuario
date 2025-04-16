const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  welcome,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", welcome);
router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getAllUsers);

module.exports = router;
