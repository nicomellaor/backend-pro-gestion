const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * @desc   Obtener todos los usuarios
 * @route  GET /api/users
 * @access Público
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // no retornamos la contraseña
    res.json(users);
  } catch (error) {
    next(error); // delegamos al middleware de errores
  }
};

/**
 * @desc   Crear un nuevo usuario
 * @route  POST /api/users
 * @access Público
 */
const postUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1) Verificar si ya existe el username
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ msg: 'El username ya está registrado' });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({ msg: 'El email ya está asociado a una cuenta' });
    }

    // 2) Hashear contraseña
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3) Crear instancia del modelo
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Retornar usuario creado
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ msg: 'Usuario creado', user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Actualizar un usuario existente
 * @route  PUT /api/users/:id
 * @access Público
 */
const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Hashear password
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario actualizado', user: updated });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'ID inválido' });
    }
    next(err);
  }
};


/**
 * @desc   Eliminar un usuario
 * @route  DELETE /api/users/:id
 * @access Público
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1) Verificar que el usuario exista
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // 2) Eliminar documento
    await User.findByIdAndDelete(id);

    res.json({ msg: `Usuario con ID ${id} eliminado correctamente` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser
};
