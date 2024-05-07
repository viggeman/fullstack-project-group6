const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');

// GET all ratings
router.get('/api/ratings', ratingsController.getAllRatings);

// GET a specific rating by ID
router.get('/api/ratings/:id', ratingsController.getRatingById);

// GET all ratings for a specific user
router.get('/api/user/ratings/:userId', ratingsController.getUserRatings);

// POST a new rating
router.post('/api/ratings', ratingsController.createRating);

// PUT update a rating by ID
router.put('/api/ratings/:id', ratingsController.updateRatingById);

// DELETE a rating by ID
router.delete('/api/ratings/:id', ratingsController.deleteRatingById);

module.exports = router;
