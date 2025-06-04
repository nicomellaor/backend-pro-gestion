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

    // Hashear la contraseña con bcrypt, validaciones, etc.
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ msg: 'El username ya está registrado' });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({ msg: 'El email ya está asociado a una cuenta' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ msg: 'Usuario creado', user });
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
    const { id } = req.params; // Se obtiene de la URL ('/api/users/:id')
    const { username, email, password } = req.body;

    // 1) Verificar que el usuario exista
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // 2) Validar si el username va a cambiar y si ya existe otro usuario con ese username
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({ msg: 'El username ya está en uso por otro usuario' });
      }
    }

    if (email && email !== user.email) {
      const existsEmail = await User.findOne({ email });
      if (existsEmail) {
        return res.status(400).json({ msg: 'El email ya está en uso por otro usuario' });
      }
    }

    // 3) Actualizar campos
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      // Hashear la nueva contraseña con bcrypt antes de asignar
      user.password = password;
    }

    const updatedUser = await user.save();

    // Retornar usuario actualizado
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    res.json({ msg: 'Usuario actualizado', user: userWithoutPassword });
  } catch (error) {
    next(error);
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
