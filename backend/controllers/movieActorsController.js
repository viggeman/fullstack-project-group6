const connectionMySQL = require('../connectionMySQL');

// Add an actor to a movie
exports.addActorToMovie = async (req, res) => {
    const { movieMId, actorAId } = req.body;
    let query = 'INSERT INTO movieActors (movieMId, actorAId) VALUES (?, ?)';
    try {
        await connectionMySQL.query(
            query,
            [movieMId, actorAId],
            (error, results) => {
                if (error) throw error;
                return res.status(201).json({
                    success: true,
                    message: 'Actor added to movie successfully',
                    movieMId: movieMId,
                    actorAId: actorAId,
                });
            }
        );
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Remove an actor from a movie
exports.removeActorFromMovie = async (req, res) => {
    const { movieMId, actorAId } = req.body;
    let query = 'DELETE FROM movieActors WHERE movieMId = ? AND actorAId = ?';
    try {
        await connectionMySQL.query(
            query,
            [movieMId, actorAId],
            (error, results) => {
                if (error) throw error;
                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: `Relation between movieMId: ${movieMId} and actorAId: ${actorAId} not found`,
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: 'Actor removed from movie successfully',
                    movieMId: movieMId,
                    actorAId: actorAId,
                });
            }
        );
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Get all actors for a movie
exports.getActorsForMovie = async (req, res) => {
    const { movieMId } = req.params;
    if (isNaN(movieMId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid movie id',
        });
    }
    let query = 'SELECT * FROM movieActors WHERE movieMId = ?';
    try {
        await connectionMySQL.query(query, [movieMId], (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};
