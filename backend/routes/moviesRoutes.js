const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

// GET request to fetch all movies
router.get('/api/movies', moviesController.getAllMovies);

// GET request to fetch a specific movie by ID
router.get('/api/movies/:movieId', moviesController.getMovieById);

// POST request to add a new movie
router.post('/api/movies', moviesController.addMovie);

// DELETE request to delete a specific movie by ID
router.delete('/api/movies/:movieId', moviesController.deleteMovieById);

// PUT request to update a specific movie by ID
router.put('/api/movies/:movieId', moviesController.updateMovieById);

module.exports = router;
