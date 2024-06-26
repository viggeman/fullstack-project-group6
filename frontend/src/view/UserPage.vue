<template>
    <div class="container">
        <button @click="handleLogout" class="submit-button">Logout</button>
        <!-- Add movie rating form -->
        <div v-if="movies.length > 0" class="movie-section">
            <h2>Rate a Movie</h2>
            <select v-model="selectedMovie" class="select-field">
                <option disabled value="">Choose movie</option>
                <option
                    v-for="movie in movies"
                    :key="movie.movieId"
                    :value="movie.movieId"
                >
                    {{ movie.movieName }}
                </option>
            </select>
            <br />
            <select v-model="selectedRating" class="select-field">
                <option disabled value="">Rate</option>
                <option v-for="rating in ratings" :key="rating" :value="rating">
                    {{ rating }}
                </option>
            </select>
            <!-- Conditional rendering of the button -->
            <button
                @click="submitRating"
                :disabled="!selectedMovie || !selectedRating"
                class="submit-button"
            >
                Submit
            </button>
        </div>
        <div v-else class="movie-section">
            <p>Loading movies...</p>
        </div>
        <!-- List of user's rated movies -->
        <div v-if="ratedMovies.length > 0" class="movie-section">
            <h2>Rated Movies</h2>
            <ul>
                <li v-for="movie in ratedMovies" :key="movie.movieId">
                    {{ movie.movieName }} - Rating: {{ movie.rating }}
                </li>
            </ul>
        </div>
        <!-- Update movie rating form -->
        <div class="input-section">
            <h2 class="movie-section">Update Rating</h2>
            <select
                v-model="selectedRatedMovie"
                @change="updateSelectedRating"
                class="select-field"
            >
                <option disabled value="">Choose movie</option>
                <option
                    v-for="movie in ratedMovies"
                    :key="movie.movieId"
                    :value="movie"
                >
                    {{ movie.movieName }}
                </option>
            </select>
            <div v-if="selectedRatedMovie">
                <p class="movie-section">
                    Current Rating: {{ selectedRatedMovie.rating }}
                </p>
                <select v-model="selectedUpdatedRating" class="select-field">
                    <option
                        v-for="rating in ratings"
                        :key="rating"
                        :value="rating"
                    >
                        {{ rating }}
                    </option>
                </select>
                <button @click="updateRating" class="submit-button">
                    Update Rating
                </button>
                <button
                    @click="deleteRating"
                    v-if="selectedRatedMovie"
                    class="submit-button"
                >
                    Delete Rating
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';
import { useUserStore } from '../stores/userStore.js';

const rUrl = 'http://localhost:3000/api/ratings/';
const mUrl = 'http://localhost:3000/api/movies/';
const userStore = useUserStore();

const userId = ref(null);
const isLoggedIn = ref(false);
const userName = ref('');
const selectedMovie = ref(null);
const selectedRating = ref(null);
const movies = ref([]);
const ratings = ref([1, 2, 3, 4, 5]);
const ratedMovies = ref([]);
const selectedRatedMovie = ref(null);
const selectedUpdatedRating = ref(null);

const userData = JSON.parse(localStorage.getItem('userData'));
if (userData) {
    isLoggedIn.value = userData.isLoggedIn;
    userId.value = userData.userId;
    userName.value = userData.userName;
}

userStore.$subscribe(() => {
    isLoggedIn.value = userStore.isLoggedIn;
});

onMounted(async () => {
    if (isLoggedIn.value) {
        await fetchRatedMovies();
        await fetchMovies();
    }
});

const setResponse = (data, msg) => {
    response.value = {
        success: data.success,
        message: msg ? `${data.message}: ${msg}` : data.message,
    };

    setTimeout(() => {
        response.value = {
            success: null,
            message: '',
        };
    }, 5000);
};

const submitRating = async () => {
    // Check if the selected movie is already rated by the user
    const alreadyRated = ratedMovies.value.some(
        (movie) => movie.movieId === selectedMovie.value
    );

    if (alreadyRated) {
        console.error('You have already rated this movie.');
        return;
    }

    // If not already rated, proceed to submit the rating
    const res = await postData(rUrl, {
        userId: userId.value,
        movieId: selectedMovie.value,
        rating: selectedRating.value,
    });

    console.log(res, 'res1');

    // Handle response from backend, show success or error message to user
    if (res) {
        // Update ratedMovies directly with the newly added rating
        const newRating = {
            movieId: selectedMovie.value,
            rating: selectedRating.value,
        };
        ratedMovies.value.push(newRating);

        // Clear the selected movie and rating after submitting
        selectedMovie.value = null;
        selectedRating.value = null;

        // Manually update the movie name for the newly added rating
        const matchedMovie = await fetchMovies(selectedMovie.value);
        newRating.movieName = matchedMovie ? matchedMovie.movieName : 'Unknown';
    } else {
        const errorMessage = res.message || 'Unknown error';
        console.error('Error submitting rating:', res.statusText);
        console.log('Response from server:', res);
    }
};

// Funktion för att hämta filmer från backend
const fetchMovies = async () => {
    try {
        const movieData = await fetchData(mUrl);
        // Uppdatera movies-arrayen med svaret
        movies.value = movieData;

        // Hämta betygsatta filmer efter att alla filmer har hämtats
        await fetchRatedMovies();
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

// Funktion för att hämta betygsatta filmer från backend
const fetchRatedMovies = async () => {
    try {
        if (!userId.value) {
            console.error('userId is null');
            return;
        }

        const ratedMoviesData = await fetchData(
            `http://localhost:3000/api/user/ratings/${userId.value}`
        );
        // Hämta filmdata från mUrl
        const allMoviesData = await fetchData(mUrl);

        // Loopa igenom betygsdata och matcha movieId med filmdata för att få filmtitlar
        ratedMovies.value = ratedMoviesData.map((ratedMovie) => {
            const matchedMovie = allMoviesData.find(
                (movie) => movie.movieId === ratedMovie.movieId
            );
            return {
                ...ratedMovie,
                movieName: matchedMovie ? matchedMovie.movieName : 'Unknown',
            };
        });
    } catch (error) {
        console.error('Error fetching rated movies:', error);
    }
};

const updateSelectedRating = () => {
    if (selectedMovie.value) {
        selectedRating.value = selectedMovie.value.rating;
    }
};

const updateRating = async () => {
    if (!selectedRatedMovie) {
        console.error('No movie selected to update rating');
        return;
    }

    try {
        // Skapa bodyn för PUT-förfrågan
        const body = {
            rating: selectedUpdatedRating.value,
        };

        // Uppdatera betyg i backend
        await putData(`${rUrl}${selectedRatedMovie.value._id}`, body);

        // Uppdatera listan över betygsatta filmer
        await fetchRatedMovies();

        // Rensa vald betygsatt film och betyg efter uppdatering
        selectedRatedMovie.value = null;
        selectedUpdatedRating.value = null;
    } catch (error) {
        console.error('Error updating rating:', error.message);
    }
};

const deleteRating = async () => {
    if (!selectedRatedMovie) {
        console.error('No movie selected to delete rating');
        return;
    }

    try {
        await deleteData(`${rUrl}${selectedRatedMovie.value._id}`);
        await fetchRatedMovies();
        console.log('Rating deleted successfully');
    } catch (error) {
        console.error('Error deleting rating:', error.message);
    }
};

const handleLogout = () => {
    userStore.logout();
    isLoggedIn.value = false;
};
</script>

<style scoped>
.container {
    background-color: black;
    background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
    height: 100vh;
    margin: 0;
    overflow: hidden;
    padding: 2rem;
    color: white;
    font: 1.3rem Inconsolata, monospace;
    text-shadow: 0 0 5px #c8c8c8;
    position: relative;
}

.movie-section {
    padding: 10px;
}

.movie-section h1 {
    font-size: 16px;
}

.input-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
}

.input-field,
.select-field {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #fff;
    background-color: #000;
    color: #fff;
    width: 200px;
    font-family: Inconsolata, monospace;
}

.small-input {
    width: 100%;
}

.input-field::placeholder,
.select-field option {
    color: #888;
}

.submit-button {
    padding: 5px 10px;
    border: 1px solid #fff;
    background-color: #888;
    color: #000;
    cursor: pointer;
}

.error-message {
    color: #ff6347;
}

.success-message {
    color: #32cd32;
}

.container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.15),
        rgba(255, 255, 255, 0.15) 1px,
        transparent 4px,
        transparent 4px
    );
    pointer-events: none;
}
</style>
