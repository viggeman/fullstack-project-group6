const express = require('express');
const router = express.Router();
const composersController = require('../controllers/composersController.js');

//GET request to fetch all composers
router.get('/api/composers', composersController.getComposers);

//GET request to fetch specific composer
router.get('/api/composers/:id', composersController.getComposer);

// GET request to fetch all composers with their movies
router.get('/api/composersmovies', composersController.getAllComposersMovies);

//POST request to add new composer
router.post('/api/composers', composersController.createComposer);

//POST request to add a movie to a specific composer
router.post('/api/composers/:id/movies', composersController.addComposerMovie);

//DELETE request to delete specific composer by ID
router.delete('/api/composers', composersController.deleteComposer);

//PUT request to update specific composer by ID
router.put('/api/composers/:id', composersController.updateComposer);

module.exports = router;
