const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// GET all ratings
router.get('/api/ratings', ratingController.getAllRatings);

// GET a specific rating by ID
router.get('/api/ratings/:id', ratingController.getRatingById);

// POST a new rating
router.post('/api/ratings', ratingController.createRating);

// PUT update a rating by ID
router.put('/api/ratings/:id', ratingController.updateRatingById);

// DELETE a rating by ID
router.delete('/api/ratings/:id', ratingController.deleteRatingById);

module.exports = router;
