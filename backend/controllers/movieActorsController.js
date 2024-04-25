const connection = require('../connectionMySQL');

const MovieActorsController = {
    // Hämta alla skådespelare för en viss film
    getActorsByMovieId(req, res) {
        const movieId = req.params.movieId;
        const sql =
            'SELECT * FROM actors JOIN movieActors ON actors.actorId = movieActors.actorAId WHERE movieActors.movieMId = ?';
        connection.query(sql, [movieId], (error, results, fields) => {
            if (error) {
                console.error('Error fetching actors for movie:', error);
                res.status(500).json({
                    error: 'Kunde inte hämta skådespelare för film',
                });
                return;
            }
            res.json(results);
        });
    },

    // Hämta alla filmer för en viss skådespelare
    getMoviesByActorId(req, res) {
        const actorId = req.params.actorId;
        const sql =
            'SELECT * FROM movies JOIN movieActors ON movies.movieId = movieActors.movieMId WHERE movieActors.actorAId = ?';
        connection.query(sql, [actorId], (error, results, fields) => {
            if (error) {
                console.error('Error fetching movies for actor:', error);
                res.status(500).json({
                    error: 'Kunde inte hämta filmer för skådespelare',
                });
                return;
            }
            res.json(results);
        });
    },

    // Lägg till en skådespelare till en film
    addActorToMovie(req, res) {
        const { movieId, actorId } = req.body;
        const sql =
            'INSERT INTO movieActors (movieMId, actorAId) VALUES (?, ?)';
        connection.query(sql, [movieId, actorId], (error, results, fields) => {
            if (error) {
                console.error('Error adding actor to movie:', error);
                res.status(500).json({
                    error: 'Kunde inte lägga till skådespelare till film',
                });
                return;
            }
            res.status(201).json({
                message: 'Skådespelare tillagd till film',
                movieId,
                actorId,
            });
        });
    },

    // Ta bort en skådespelare från en film
    removeActorFromMovie(req, res) {
        const { movieId, actorId } = req.body;
        const sql =
            'DELETE FROM movieActors WHERE movieMId = ? AND actorAId = ?';
        connection.query(sql, [movieId, actorId], (error, results, fields) => {
            if (error) {
                console.error('Error removing actor from movie:', error);
                res.status(500).json({
                    error: 'Kunde inte ta bort skådespelare från film',
                });
                return;
            }
            res.json({ message: 'Skådespelare borttagen från film' });
        });
    },
};

module.exports = MovieActorsController;
