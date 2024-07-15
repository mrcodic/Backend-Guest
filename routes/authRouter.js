const express = require("express");

const router = express.Router();

const isAuth = require("../middlewares/isAuth");

const { login, logout, signiup } = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", isAuth, logout);
router.post("/signup", signiup);

module.exports = router;
