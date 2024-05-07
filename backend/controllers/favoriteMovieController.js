const {
  FavoriteMovie,
  updateFavoriteMovies,
} = require('../models/favoriteMovieModel');

exports.getFavoriteMovies = async (req, res) => {
  try {
    const allFavoriteMovies = await FavoriteMovie.find();
    res.json(allFavoriteMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a favorite list
exports.createFavoriteList = async (req, res) => {
  try {
    const newFavorite = new FavoriteMovie(req.body);
    await newFavorite.save();
    res.json(newFavorite);
  } catch (error) {
    console.error('Error creating favorite:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all favorite lists for a user
exports.getFavoriteLists = async (req, res) => {
  try {
    const favorites = await FavoriteMovie.find({
      userId: req.params.userId,
    });
    if (!favorites)
      return res.status(404).json({ message: 'No favorites found' });
    res.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a favorite list (edit only title)
exports.updateListTitle = async (req, res) => {
  try {
    const { favoriteListTitle } = req.body; // Destructure only title from request body

    const updatedFavorite = await FavoriteMovie.findByIdAndUpdate(
      req.params.id,
      { favoriteListTitle }, // Update only the specified field
      { new: true } // Return the updated document
    );
    if (!updatedFavorite)
      return res.status(404).json({ message: 'Favorite not found' });
    res.json(updatedFavorite);
  } catch (error) {
    console.error('Error updating favorite:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addMovie = async (req, res) => {
  const { id, movieId } = req.params;
  const success = await updateFavoriteMovies(id, movieId, 'add');
  if (!success) return res.status(400).json({ message: 'Error adding movie' });
  res.json({ message: 'Movie added to favorites successfully' });
};

exports.removeMovie = async (req, res) => {
  const { id, movieId } = req.params;
  const success = await updateFavoriteMovies(id, movieId, 'remove');
  if (!success)
    return res.status(400).json({ message: 'Error removing movie' });
  res.json({ message: 'Movie removed from favorites successfully' });
};
