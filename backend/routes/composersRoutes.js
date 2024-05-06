const express = require('express');
const router = express.Router();
const composersController = require('../controllers/composersController.js');

//GET request to fetch all composers
router.get('/api/composers', composersController.getComposers);

//GET request to fetch specific composer
router.get('/api/composers/:id', composersController.getComposer);

//POST request to add new actor
router.post('/api/composer', composersController.createComposer);

//DELETE request to delete specific composer by ID
router.delete('/api/composer', composersController.deleteComposer);

//PUT request to update specific composer by ID
router.put('/api/composer', composersController.updateComposer);

module.exports = router;
