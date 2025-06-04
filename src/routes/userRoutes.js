const express = require('express');
const router = express.Router();
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
router.post('/:id', putUser);

// DELETE /api/users
router.post('/:id', deleteUser);

module.exports = router;
