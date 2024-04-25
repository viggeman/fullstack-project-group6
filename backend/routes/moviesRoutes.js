const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

// GET request to fetch all movies
router.get('/api/movies', moviesController.getMovies);

// GET request to fetch a specific movie by ID
router.get('/api/movies/:id', moviesController.getMovie);

// POST request to add a new movie
router.post('/api/movies', moviesController.createMovie);

// DELETE request to delete a specific movie by ID
router.delete('/api/movies', moviesController.deleteMovie);

// PUT request to update a specific movie by ID
router.put('/api/movies', moviesController.updateMovie);

module.exports = router;
