const express = require('express');
const router = express.Router();
const movieActorsController = require('../controllers/movieActorsController');

// POST request to add an actor to a movie
router.post('/api/movie-actors', movieActorsController.addActorToMovie);

// DELETE request to remove an actor from a movie
router.delete('/api/movie-actors', movieActorsController.removeActorFromMovie);

// GET request to fetch all actors for a movie
router.get(
    '/api/movie-actors/:movieMId',
    movieActorsController.getActorsForMovie
);

module.exports = router;
