const util = require('util');
const connectionMySQL = require('../connectionMySQL');
const queryAsync = util.promisify(connectionMySQL.query).bind(connectionMySQL);

// Get a movie by id
exports.getMovie = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid movie id',
        });
    }
    let query = 'SELECT * FROM movies WHERE movieId = ?';
    try {
        await connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Movie with id ${id} not found`,
                });
            }
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Get all movies
exports.getMovies = async (req, res) => {
    let query = 'SELECT * FROM movies';
    try {
        await connectionMySQL.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Create a movie
exports.createMovie = async (req, res) => {
    const {
        movieName,
        movieReleaseYear,
        imdbId,
        genreGId,
        writerWId,
        directorDId,
    } = req.body;

    // Lägg till en variabel för det senaste infogade ID:t
    let lastInsertId;

    let query =
        'INSERT INTO movies (movieName, movieReleaseYear, imdbId, genreGId, writerWId, directorDId) VALUES (?, ?, ?, ?, ?, ?)';
    if (!movieName || movieName === '') {
        return res.status(400).json({
            success: false,
            message: 'Provide movie name',
        });
    }

    try {
        const results = await queryAsync(query, [
            movieName,
            movieReleaseYear,
            imdbId,
            genreGId,
            writerWId,
            directorDId,
        ]);

        // Hämta det senaste infogade ID:t från resultaten
        if (results && results.insertId) {
            lastInsertId = results.insertId;
        }

        return res.status(201).json({
            success: true,
            message: 'POST movie successful',
            movieId: lastInsertId,
            name: movieName,
            releaseYear: movieReleaseYear,
            imdbId: imdbId,
            genreGId: genreGId,
            writerWId: writerWId,
            directorDId: directorDId,
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Update a movie
exports.updateMovie = async (req, res) => {
    const {
        id,
        movieName,
        movieReleaseYear,
        imdbId,
        genreGId,
        writerWId,
        directorDId,
    } = req.body;
    let query =
        'UPDATE movies SET movieName = ?, movieReleaseYear = ?, imdbId = ?, genreGId = ?, writerWId = ?, directorDId = ? WHERE movieId = ?';
    const params = [
        movieName,
        movieReleaseYear,
        imdbId,
        genreGId,
        writerWId,
        directorDId,
        id,
    ];

    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid movie id',
        });
    }

    try {
        await connectionMySQL.query(query, params, (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Movie with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'PUT successful',
                id: id,
                name: movieName,
                releaseYear: movieReleaseYear,
                imdbId: imdbId,
                genreGId: genreGId,
                writerWId: writerWId,
                directorDId: directorDId,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};

// Delete a movie
exports.deleteMovie = (req, res) => {
    const { id } = req.body;
    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid movie id',
        });
    }
    let query = 'DELETE FROM movies WHERE movieId = ?';
    try {
        connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Movie with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'DELETE successful',
                id: id,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal Server Error: ' + error);
    }
};
