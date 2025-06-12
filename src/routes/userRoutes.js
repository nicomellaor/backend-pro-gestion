const express = require('express');
const router = express.Router();
const auth    = require('../middleware/auth');
const {
  getUsers,
  postUser,
  putUser,
  deleteUser,
} = require('../controllers/userController');

// GET /api/users
router.get('/', getUsers);

// POST /api/users
router.post('/', postUser);

// PUT /api/users
router.put('/:id', putUser);

// DELETE /api/users
router.delete('/:id', deleteUser);

module.exports = router;
