const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
