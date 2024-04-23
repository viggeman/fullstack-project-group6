const connection = require('../connectionMySQL');

const ActorController = {
    getAllActors(req, res) {
        connection.query('SELECT * FROM actors', (error, results, fields) => {
            if (error) {
                console.error('Error fetching actors:', error);
                res.status(500).json({
                    error: 'Kunde inte hämta skådespelare',
                });
                return;
            }
            res.json(results);
        });
    },

    getActorById(req, res) {
        const actorId = req.params.actorId;
        connection.query(
            'SELECT * FROM actors WHERE actorId = ?',
            [actorId],
            (error, results, fields) => {
                if (error) {
                    console.error('Error fetching actor:', error);
                    res.status(500).json({
                        error: 'Kunde inte hämta skådespelare',
                    });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({
                        error: 'Skådespelare med det angivna ID:t hittades inte',
                    });
                    return;
                }
                res.json(results[0]);
            }
        );
    },

    addActor(req, res) {
        const { actorName } = req.body;
        const sql = 'INSERT INTO actors (actorName) VALUES (?)';
        connection.query(sql, [actorName], (error, results, fields) => {
            if (error) {
                console.error('Error adding actor:', error);
                res.status(500).json({
                    error: 'Kunde inte lägga till skådespelare',
                });
                return;
            }
            res.status(201).json({
                message: 'Skådespelare tillagd',
                skådespelare: { actorName },
            });
        });
    },

    deleteActorById(req, res) {
        const actorId = req.params.actorId;
        console.log('Försöker ta bort skådespelare med ID:', actorId);
        const sql = 'DELETE FROM actors WHERE actorId = ?';
        connection.query(sql, [actorId], (error, results, fields) => {
            if (error) {
                console.error('Error deleting actor:', error);
                res.status(500).json({
                    error: 'Kunde inte ta bort skådespelare',
                });
                return;
            }
            console.log('Skådespelare med ID', actorId, 'har tagits bort');
            res.json({ message: 'Skådespelare borttagen' });
        });
    },

    updateActorById(req, res) {
        const actorId = req.params.actorId;
        const { actorName } = req.body;
        const sql = 'UPDATE actors SET actorName = ? WHERE actorId = ?';
        connection.query(
            sql,
            [actorName, actorId],
            (error, results, fields) => {
                if (error) {
                    console.error('Error updating actor:', error);
                    res.status(500).json({
                        error: 'Kunde inte uppdatera skådespelare',
                    });
                    return;
                }
                res.json({ message: 'Skådespelare uppdaterad' });
            }
        );
    },
};

module.exports = ActorController;
