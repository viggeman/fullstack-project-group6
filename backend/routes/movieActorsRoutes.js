const express = require('express');
const router = express.Router();
const movieActorsController = require('../controllers/movieActorsController');

// GET request för att hämta alla skådespelare för en viss film
router.get(
    '/api/movies/:movieId/actors',
    movieActorsController.getActorsByMovieId
);

// GET request för att hämta alla filmer för en viss skådespelare
router.get(
    '/api/actors/:actorId/movies',
    movieActorsController.getMoviesByActorId
);

// POST request för att lägga till en skådespelare till en film
router.post(
    '/api/movies/:movieId/actors',
    movieActorsController.addActorToMovie
);

// DELETE request för att ta bort en skådespelare från en film
router.delete(
    '/api/movies/:movieId/actors/:actorId',
    movieActorsController.removeActorFromMovie
);

module.exports = router;
