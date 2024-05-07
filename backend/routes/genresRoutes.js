const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController');

// GET - Visa alla Genre.
router.get('/api/genres', genresController.getAllGenres);

// POST - Lägg till Genre.
router.post('/api/genres', genresController.postGenre);

// DELETE - Ta bort en Genre.
router.delete('/api/genres', genresController.deleteOneGenre);

// PUT - Ändra Genre.
router.put('/api/genres', genresController.changeGenre);

module.exports = router;