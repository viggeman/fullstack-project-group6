const connectionMySQL = require('../connectionMySQL');

// Get an actor by id
exports.getActor = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid actor id',
        });
    }
    let query = 'SELECT * FROM actors WHERE actorId = ?';
    try {
        await connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Actor with id ${id} not found`,
                });
            }
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Get all actors
exports.getActors = async (req, res) => {
    let query = 'SELECT * FROM actors';
    try {
        await connectionMySQL.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Create an actor
exports.createActor = async (req, res) => {
    const { actorName } = req.body;
    let query = 'INSERT INTO actors (actorName) VALUES (?)';
    if (!actorName || actorName === '') {
        return res.status(400).json({
            success: false,
            message: 'Provide actor name',
        });
    }
    try {
        await connectionMySQL.query(query, [actorName], (error, results) => {
            if (error) throw error;
            return res.status(201).json({
                success: true,
                message: 'POST actor successfull',
                id: results.insertId,
                name: actorName,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Update an actor
exports.updateActor = async (req, res) => {
    const { id, actorName } = req.body;
    let query = 'UPDATE actors SET actorName = ? WHERE actorId = ?';
    const params = [actorName, id];

    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid actor id',
        });
    }

    try {
        await connectionMySQL.query(query, params, (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Actor with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'PUT successfull',
                id: id,
                name: actorName,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Delete an actor
exports.deleteActor = (req, res) => {
    const { id } = req.body;
    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid actor id',
        });
    }
    let query = 'DELETE FROM actors WHERE actorId = ?';
    try {
        connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Actor with id: ${id} not found`,
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
