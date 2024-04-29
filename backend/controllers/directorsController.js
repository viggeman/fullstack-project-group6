const connectionMySQL = require('../connectionMySQL');

// Get an director by id
exports.getDirector = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid director id',
        });
    }
    let query = 'SELECT * FROM directors WHERE directorId = ?';
    try {
        await connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `director with id ${id} not found`,
                });
            }
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Get all directors
exports.getDirectors = async (req, res) => {
    let query = 'SELECT * FROM directors';
    try {
        await connectionMySQL.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Create an director
exports.createDirector = async (req, res) => {
    const { directorName } = req.body;
    let query = 'INSERT INTO directors (directorName) VALUES (?)';
    if (!directorName || directorName === '') {
        return res.status(400).json({
            success: false,
            message: 'Provide director name',
        });
    }
    try {
        await connectionMySQL.query(query, [directorName], (error, results) => {
            if (error) throw error;
            return res.status(201).json({
                success: true,
                message: 'POST director successfull',
                id: results.insertId,
                name: directorName,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Update an director
exports.updateDirector = async (req, res) => {
    const { id, directorName } = req.body;
    let query = 'UPDATE directors SET directorName = ? WHERE directorId = ?';
    const params = [directorName, id];

    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid director id',
        });
    }

    try {
        await connectionMySQL.query(query, params, (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `director with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'PUT successfull',
                id: id,
                name: directorName,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Delete an director
exports.deleteDirector = (req, res) => {
    const { id } = req.body;
    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid director id',
        });
    }
    let query = 'DELETE FROM directors WHERE directorId = ?';
    try {
        connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `director with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'DELETE successfull',
                id: id,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};
