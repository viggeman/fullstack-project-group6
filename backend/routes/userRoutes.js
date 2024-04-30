const express = require('express');

const router = express.Router();

// Import your functions
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
} = require('../controllers/userController');

// Define routes
router.get('/api/users', getUsers);
router.get('/api/user/:id', getUser);
router.post('/api/users', createUser);
router.delete('/api/users/:id', deleteUser);

module.exports = router;
