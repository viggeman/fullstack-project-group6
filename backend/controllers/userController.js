// Import necessary modules and dependencies
const connectionMySQL = require('../connectionMySQL');

// GET method to fetch all users
exports.getUsers = async (req, res) => {
  let query = 'SELECT * FROM users';
  try {
    await connectionMySQL.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id',
    });
  }
  let query = 'SELECT * FROM users WHERE userId = ?';
  try {
    await connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: `User with id ${id} not found`,
        });
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

exports.createUser = async (req, res) => {
  const { userName, userPassword } = req.body;
  let query = 'INSERT INTO users (userName, userPassword) VALUES (?, ?)';
  if (!userName || userName === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide user name',
    });
  }
  if (!userPassword || userPassword === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide user password',
    });
  }
  let checkQuery = 'SELECT * FROM users WHERE userName = ?';
  try {
    await connectionMySQL.query(checkQuery, [userName], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
        });
      }
      connectionMySQL.query(
        query,
        [userName, userPassword],
        (error, results) => {
          if (error) throw error;
          return res.status(201).json({
            success: true,
            message: 'User created successfully',
            id: results.insertId,
            name: userName,
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

// DELETE method to delete a user by ID
exports.deleteUser = async (req, res) => {
  // Implement logic to delete a user by ID
  const { id } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id',
    });
  }
  let query = 'DELETE FROM users WHERE userId = ?';
  try {
    await connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `User with id ${id} not found`,
        });
      }
      return res.json({
        success: true,
        message: `User with id ${id} deleted successfully`,
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

exports.loginUser = async (req, res) => {
  // Implement logic to login a user
  const { userName, userPassword } = req.body;
  let query = 'SELECT * FROM users WHERE userName = ? AND userPassword = ?';
  if (!userName || userName === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide user name',
    });
  }
  if (!userPassword || userPassword === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide user password',
    });
  }
  try {
    await connectionMySQL.query(
      query,
      [userName, userPassword],
      (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'Invalid user name or password',
          });
        }
        return res.json({
          success: true,
          message: 'User logged in successfully',
          id: results[0].userId,
          name: userName,
        });
      }
    );
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};
exports.logoutUser = async (req, res) => {
  // Implement logic to login a user
  const { id } = req.body;
  let query = 'SELECT * FROM users WHERE userId = ?';
  try {
    await connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid user ID',
        });
      }
      return res.json({
        success: true,
        message: 'User logged out successfully',
        id: results[0].userId,
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};
