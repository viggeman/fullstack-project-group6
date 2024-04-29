const express = require('express');
const router = express.Router();
const directorsController = require('../controllers/directorsController');

// GET request to fetch all Directors
router.get('/api/directors', directorsController.getDirectors);

// GET request to fetch a specific Director by ID
router.get('/api/directors/:id', directorsController.getDirector);

// POST request to add a new Director
router.post('/api/directors', directorsController.createDirector);

// DELETE request to delete a specific Director by ID
router.delete('/api/directors/', directorsController.deleteDirector);

// PUT request to update a specific Director by ID
router.put('/api/directors/', directorsController.updateDirector);

module.exports = router;
