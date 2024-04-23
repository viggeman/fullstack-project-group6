const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorsController');

// GET request to fetch all actors
router.get('/api/actors', actorsController.getAllActors);

// GET request to fetch a specific actor by ID
router.get('/api/actors/:actorId', actorsController.getActorById);

// POST request to add a new actor
router.post('/api/actors', actorsController.addActor);

// DELETE request to delete a specific actor by ID
router.delete('/api/actors/:actorId', actorsController.deleteActorById);

// PUT request to update a specific actor by ID
router.put('/api/actors/:actorId', actorsController.updateActorById);

module.exports = router;
