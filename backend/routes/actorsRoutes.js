const express = require('express');
const router = express.Router();
const actorsController = require('../controllers/actorsController');

// GET request to fetch all actors
router.get('/api/actors', actorsController.getActors);

// GET request to fetch a specific actor by ID
router.get('/api/actors/:id', actorsController.getActor);

// POST request to add a new actor
router.post('/api/actors', actorsController.createActor);

// DELETE request to delete a specific actor by ID
router.delete('/api/actors/', actorsController.deleteActor);

// PUT request to update a specific actor by ID
router.put('/api/actors/', actorsController.updateActor);

module.exports = router;
