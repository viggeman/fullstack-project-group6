const connectionMySQL = require('../connectionMySQL');

//get a composer by ID
exports.getComposer = async (req, res) => {
  const { id } = req.params;
  if(isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid composer id'
    });
  }
  let query = 'SELECT * FROM composers WHERE composerId = ?';
  try {
    await connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: `director with id ${id} not found`
        });
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

//get all composers
exports.getComposers = async (req, res) => {
  let query = 'SELECT * FROM composers';
  try {
    await connectionMySQL.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error);
  }
};

//Create a composer
exports.createComposer = async (req, res) => {
  const { composerName } = req.body;
  let query = 'INSERT INTO composers (composerName) VALUES (?)';
  if (!composerName || composerName === '') {
    return res.status(400).json({
      success: false,
      message: 'Provide composer name'
    });
  }
  try {
    await connectionMySQL.query(query, [composerName], (error, results) => {
      if (error) throw error;
      return res.status(201).json({
        succes: true,
        message: 'POST composer successful',
        id: results.insertId,
        name: composerName
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error)
  }
};

//Update a composer
exports.updateComposer = async (req, res) => {
  const {id, composerName} = req.body;
  let query = 'UPDATE composers SET composerName = ? WHERE composerId = ?';
  const params = [composerName, id];

  if(isNaN(id) || id === '') {
    return res.status(400).json({
      success: false,
      message: 'Invalid composer id'
    });
  }

  try {
    await connectionMySQL.query(query, params, (error, results) =>{
      if (error) throw error;
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `composer with id ${id} not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'PUT request successful',
        id: id,
        name: composerName
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error)
  }
};

//Delete a composer
exports.deleteComposer = async (req, res) => {
  const { id } = req.body;
  if (isNaN(id) || id === '')  {
    return res.status(400).json({
      success: false,
      message: 'Invalid composer id'
    });
  }
  let query = 'DELETE FROM composers WHERE composerId = ?';
  try {
    connectionMySQL.query(query, [id], (error, results) => {
      if (error) throw error;
      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: `composer with id ${id} not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: 'DELETE Successful',
        id: id
      });
    });
  } catch (error) {
    return res.status(500).json('Internal Server Error: ' + error)
  }
};
