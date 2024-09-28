const connectionMySQL = require('../connectionMySQL');

//Get a composer by ID
exports.getComposer = async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid composer id',
        });
    }
    let query = 'SELECT * FROM composers WHERE composerId = ?';
    try {
        await connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `composer with id ${id} not found.`,
                });
            }
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal server error: ' + error);
    }
};

//Get all composers
exports.getComposers = async (req, res) => {
    let query = 'SELECT * FROM composers';
    try {
        await connectionMySQL.query(query, (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json('Internal server error: ' + error);
    }
};

//Get all composers with the connected movies
exports.getAllComposersMovies = async (req, res) => {
  let query = `
  SELECT composers.composerId, composers.composerName,
         movies.movieId, movies.movieName, movies.movieReleaseYear
  FROM composers
  LEFT JOIN movies ON composers.composerId = movies.composerCId`;
  try {
    console.log('Executing query:', query);
    await connectionMySQL.query(query, (error, results) => {
      if (error) {
        console.error('Query error:', error);
        throw error;
      }
      console.log('Query results:', results);

      const composers = results.reduce((acc, row) => {
        let composer = acc.find(c => c.composerId === row.composerId);
        if (!composer) {
          composer = { composerId: row.composerId, composerName: row.composerName, movies: [] };
          acc.push(composer);
        }
        if (row.movieId) {
          composer.movies.push({
            movieId: row.movieId,
            movieName: row.movieName,
            movieReleaseYear: row.movieReleaseYear
          });
        }
        return acc;
      }, []);

      res.json(composers);
    });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json('Internal server error: ' + error);
  }
};

//Add movie to composer
exports.addComposerMovie = async (req, res) => {
  const { id } = req.params;
  const { movieName, movieReleaseYear } = req.body;

  if (!movieName || !movieReleaseYear) {
    return res.status(400).json({ success: false, message: 'Movie name and release year are required' });
  }

  let query = 'INSERT INTO movies (movieName, movieReleaseYear, composerCId) VALUES (?, ?, ?)';
  try {
    await connectionMySQL.query(query, [movieName, parseInt(movieReleaseYear), id], (error, results) => {
      if (error) throw error;
      return res.status(201).json({
        success: true,
        message: 'Movie added successfully',
        movieId: results.insertId,
        composerId: id,
        movieName: movieName
      });
    });
  } catch (error) {
    return res.status(500).json('Internal server error: ' + error);
  }
};

//Create a composer
exports.createComposer = async (req, res) => {
    const { composerName } = req.body;
    let query = 'INSERT INTO composers (composerName) VALUES (?)';
    if (!composerName || composerName === '') {
        return res.status(400).json({
            success: false,
            message: 'Provide composer name',
        });
    }
    try {
        await connectionMySQL.query(query, [composerName], (error, results) => {
            if (error) throw error;
            return res.status(201).json({
                success: true,
                message: 'POST composer successful',
                id: results.insertId,
                name: composerName,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal server error: ' + error);
    }
};

//Update a composer
exports.updateComposer = async (req, res) => {
  const { id } = req.params;
  const { composerName } = req.body; // Change this to get from req.body

  if (!id || !composerName) {
      return res.status(400).json({
          success: false,
          message: 'Composer name and id are required.',
      });
  }
  console.log(id);
  console.log(composerName);

  let query = 'UPDATE composers SET composerName = ? WHERE composerId = ?';
  const params = [composerName, id];

  try {
      await connectionMySQL.query(query, params, (error, results) => {
          if (error) throw error;
          if (results.affectedRows === 0) {
              return res.status(404).json({
                  success: false,
                  message: `composer with id: ${id} not found`
              });
          }
          return res.status(200).json({
              success: true,
              message: 'PUT successful',
              id: id,
              name: composerName,
          });
      });
  } catch (error) {
      return res.status(500).json('Internal server error: ' + error);
  }
};

//Delete a composer
exports.deleteComposer = (req, res) => {
    const { id } = req.body;
    if (isNaN(id) || id === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid composer id',
        });
    }
    let query = 'DELETE FROM composers WHERE composerId = ?';
    try {
        connectionMySQL.query(query, [id], (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `composer with id: ${id} not found`,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'DELETE successful',
                id: id,
            });
        });
    } catch (error) {
        return res.status(500).json('Internal server error: ' + error);
    }
};
