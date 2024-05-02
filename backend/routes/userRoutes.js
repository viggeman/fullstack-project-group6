const express = require('express');

const router = express.Router();

// Import your functions
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  loginUser,
  logoutUser,
} = require('../controllers/userController');

// Define routes
router.get('/api/users', getUsers);
router.get('/api/user/:id', getUser);
router.post('/api/users', createUser);
router.post('/api/user/login', loginUser);
router.post('/api/user/logout', logoutUser);
router.delete('/api/users', deleteUser);

module.exports = router;
