const express = require('express');
const router = express.Router();
const favoriteMovieController = require('../controllers/favoriteMovieController');

router.get('/api/favorite-movies', favoriteMovieController.getFavoriteMovies);
router.get(
  '/api/favorite-movies/:userId',
  favoriteMovieController.getFavoriteLists
);
router.post('/api/favorite-movies', favoriteMovieController.createFavoriteList);
router.put('/api/favorite-movies/:id', favoriteMovieController.updateListTitle);

router.put(
  '/api/favorite-movies/:id/movies/:movieId',
  favoriteMovieController.addMovie
);
router.delete(
  '/api/favorite-movies/:id/movies/:movieId',
  favoriteMovieController.removeMovie
);

module.exports = router;
