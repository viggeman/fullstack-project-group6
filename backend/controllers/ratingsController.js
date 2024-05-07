const Rating = require('../models/Rating');

// Controller functions
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRatingById = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRating = async (req, res) => {
    const rating = new Rating({
        rating: req.body.rating,
    });
    try {
        const newRating = await rating.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateRatingById = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        rating.rating = req.body.rating;
        const updatedRating = await rating.save();
        res.json(updatedRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRatingById = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        await rating.remove();
        res.json({ message: 'Rating deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
