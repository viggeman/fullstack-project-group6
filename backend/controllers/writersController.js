const connectionMySQL = require('./../connectionMySQL');

// Get a writer by id
exports.getWriter = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid writer id',
    });
  }
  let query = 'SELECT * FROM writers WHERE writerId = ?';
  try {
    await connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Writer with id ${id} not found`,
        });
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

// Get all writers
exports.getWriters = async (req, res) => {
  let query = 'SELECT * FROM writers';
  try {
    await connectionMySQL.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

// Create a writer
exports.createWriter = async (req, res) => {
  const { writerName } = req.body;
  let query = 'INSERT INTO writers (writerName) VALUES (?)';
  if (!writerName || writerName === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide writer name',
    });
  }
  try {
    await connectionMySQL.query(query, [writerName], (error, results) => {
      if (error) throw error;
      return res.status(201).json({
        success: true,
        message: 'POST writer successfull',
        id: results.insertId,
        name: writerName,
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

// Update a writer
exports.updateWriter = async (req, res) => {
  const { id, writerName } = req.body;
  let query = 'UPDATE writers SET writerName = ? WHERE writerId = ?';
  const params = [writerName, id];

  if (isNaN(id) || id === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid writer id',
    });
  }

  try {
    await connectionMySQL.query(query, params, (error, results) => {
      if (error) throw error;
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `Writer with id: ${id} not found`,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'PUT successfull',
        id: id,
        name: writerName,
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

// Delete a writer
exports.deleteWriter = (req, res) => {
  const { id } = req.body;
  if (isNaN(id) || id === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid writer id',
    });
  }
  let checkQuery = 'SELECT * FROM movies WHERE writerWId = ?';
  try {
    connectionMySQL.query(checkQuery, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete writer with id: ${id} because it is connected to movies`,
        });
      }
      let deleteQuery = 'DELETE FROM writers WHERE writerId = ?';
      connectionMySQL.query(deleteQuery, [id], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: `Writer with id: ${id} not found`,
          });
        }
        return res.status(200).json({
          success: true,
          message: 'DELETE successful',
          id: id,
        });
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};
