const express = require("express");
const router = express.Router();
const { registerNormalUser, loginNormalUser } = require("../controller/normalUserController");

// Register normal user
router.post("/register", registerNormalUser);

// Login normal user
router.post("/login", loginNormalUser);

module.exports = router; 