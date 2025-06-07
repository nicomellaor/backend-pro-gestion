const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // 1) Leer el header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // 2) Verificar el token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Comprobar que el usuario aún existe
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ msg: 'Usuario no encontrado' });
    }

    // 4) Poner userId (y/o usuario) en la petición
    req.userId = payload.userId;
    // req.user = usuario;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
