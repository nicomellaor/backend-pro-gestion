const express = require('express');
const router  = express.Router();
const { signup, login } = require('../controllers/authController');

// Registro
router.post('/signup', signup);

// Inicio de sesión
router.post('/login',  login);

module.exports = router;
