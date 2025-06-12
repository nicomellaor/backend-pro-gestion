const User = require('../models/User');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

/**
 * @desc   Registro de un nuevo usuario (signup)
 * @route  POST /api/auth/signup
 * @access Público
 */
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1) Comprueba que no exista ya ese username/email
    if (await User.findOne({ username })) {
      return res.status(400).json({ msg: 'El username ya está registrado' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'El email ya está registrado' });
    }

    // 2) Hashea la contraseña
    const salt     = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    // 3) Crea y guarda el usuario
    const user = new User({ username, email, password: hashPass });
    await user.save();

    // 4) Devuelve datos básicos (sin password)
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ msg: 'User registrado', user: userData });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Inicio de sesión (login)
 * @route  POST /api/auth/login
 * @access Público
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1) Busca al usuario por username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    // 2) Compara la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    // 3) Genera el JWT con su payload
    const payload = { userId: user._id };
    const token   = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 4) Devuelve token y datos de usuario
    const { password: _, ...userData } = user.toObject();
    res.json({
      msg:    'Login exitoso',
      token,
      user:   userData
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
