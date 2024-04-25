const connection = require('../connectionMySQL');

const MovieController = {
    getAllMovies(req, res) {
        connection.query('SELECT * FROM movies', (error, results, fields) => {
            if (error) {
                console.error('Error fetching movies:', error);
                res.status(500).json({
                    error: 'Kunde inte hämta filmer',
                });
                return;
            }
            res.json(results);
        });
    },

    getMovieById(req, res) {
        const movieId = req.params.movieId;
        connection.query(
            'SELECT * FROM movies WHERE movieId = ?',
            [movieId],
            (error, results, fields) => {
                if (error) {
                    console.error('Error fetching movie:', error);
                    res.status(500).json({
                        error: 'Kunde inte hämta film',
                    });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({
                        error: 'Film med det angivna ID:t hittades inte',
                    });
                    return;
                }
                res.json(results[0]);
            }
        );
    },

    addMovie(req, res) {
        const {
            movieName,
            movieReleaseYear,
            imdbId,
            genreGId,
            writerWId,
            directorDId,
        } = req.body;
        const sql =
            'INSERT INTO movies (movieName, movieReleaseYear, imdbId, genreGId, writerWId, directorDId) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(
            sql,
            [
                movieName,
                movieReleaseYear,
                imdbId,
                genreGId,
                writerWId,
                directorDId,
            ],
            (error, results, fields) => {
                if (error) {
                    console.error('Error adding movie:', error);
                    res.status(500).json({
                        error: 'Kunde inte lägga till film',
                    });
                    return;
                }
                res.status(201).json({
                    message: 'Film tillagd',
                    film: {
                        movieName,
                        movieReleaseYear,
                        imdbId,
                        genreGId,
                        writerWId,
                        directorDId,
                    },
                });
            }
        );
    },

    deleteMovieById(req, res) {
        const movieId = req.params.movieId;
        console.log('Försöker ta bort film med ID:', movieId);
        const sql = 'DELETE FROM movies WHERE movieId = ?';
        connection.query(sql, [movieId], (error, results, fields) => {
            if (error) {
                console.error('Error deleting movie:', error);
                res.status(500).json({
                    error: 'Kunde inte ta bort film',
                });
                return;
            }
            console.log('Film med ID', movieId, 'har tagits bort');
            res.json({ message: 'Film borttagen' });
        });
    },

    updateMovieById(req, res) {
        const movieId = req.params.movieId;
        const {
            movieName,
            movieReleaseYear,
            imdbId,
            genreGId,
            writerWId,
            directorDId,
        } = req.body;
        const sql =
            'UPDATE movies SET movieName = ?, movieReleaseYear = ?, imdbId = ?, genreGId = ?, writerWId = ?, directorDId = ? WHERE movieId = ?';
        connection.query(
            sql,
            [
                movieName,
                movieReleaseYear,
                imdbId,
                genreGId,
                writerWId,
                directorDId,
                movieId,
            ],
            (error, results, fields) => {
                if (error) {
                    console.error('Error updating movie:', error);
                    res.status(500).json({
                        error: 'Kunde inte uppdatera film',
                    });
                    return;
                }
                res.json({ message: 'Film uppdaterad' });
            }
        );
    },
};

module.exports = MovieController;
