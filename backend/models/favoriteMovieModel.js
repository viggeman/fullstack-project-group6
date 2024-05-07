const mongoose = require('mongoose');

const favoriteMovieSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  favoriteListTitle: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
});

const updateFavoriteMovies = async (favoriteId, movieId, action) => {
  try {
    const favorite = await FavoriteMovie.findById(favoriteId);
    if (!favorite) return false; // Favorite not found

    const movies = favorite.movies;
    let updatedMovies;

    if (action === 'add') {
      // Check for duplicates before adding
      if (movies.find((movie) => movie.movieId === movieId)) return false; // Duplicate movie

      updatedMovies = [...movies, { movieId }];
    } else if (action === 'remove') {
      updatedMovies = movies.filter((movie) => movie.movieId !== movieId);
    } else {
      return false; // Invalid action
    }

    favorite.movies = updatedMovies;
    await favorite.save();
    return true;
  } catch (error) {
    console.error('Error updating favorite movies:', error);
    return false;
  }
};

const FavoriteMovie = mongoose.model('favoritemovie', favoriteMovieSchema);

module.exports = {
  FavoriteMovie,
  updateFavoriteMovies,
};
