<script setup>
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore.js';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const router = useRouter();
const uUrl = 'http://localhost:3000/api/user/';
// const rUrl = 'http://localhost:3000/api/ratings/';
// const mUrl = 'http://localhost:3000/api/movies/';

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

const userData = JSON.parse(localStorage.getItem('userData'));

const userId = ref(userData ? userData.userId : null);
const userName = ref(userData ? userData.userName : '');

const response = ref({ success: null, message: '' }); // Lägg till response
const isLoggedIn = ref(userData !== null); // Ändra till ref

const loginPassword = ref('');
const loginName = ref('');
const userStore = useUserStore();
const getMovieData = ref(null);
// const selectedMovie = ref(null);
// const selectedRating = ref(null);
// const movies = ref([]);
// const ratings = ref([1, 2, 3, 4, 5]);
// const ratedMovies = ref([]);
// const selectedRatedMovie = ref(null);
// const selectedUpdatedRating = ref(null);

// onMounted(async () => {
//     watch(isLoggedIn, async (newValue) => {
//         if (newValue) {
//             await fetchMovies();
//             await fetchRatedMovies();
//         }
//     });
// });

// const submitRating = async () => {
//     // Check if the selected movie is already rated by the user
//     const alreadyRated = ratedMovies.value.some(
//         (movie) => movie.movieId === selectedMovie.value
//     );

//     if (alreadyRated) {
//         console.error('You have already rated this movie.');
//         return;
//     }

//     // If not already rated, proceed to submit the rating
//     const res = await postData(rUrl, {
//         userId: userId.value,
//         movieId: selectedMovie.value,
//         rating: selectedRating.value,
//     });

//     if (res !== undefined) {
//         // Här kan du logga res-objektet eller utföra andra åtgärder med det
//         console.log(res);
//     } else {
//         console.log('res är inte definierad.');
//     }

//     // Handle response from backend, show success or error message to user
//     if (res.success) {
//         // Update ratedMovies directly with the newly added rating
//         ratedMovies.value.push({
//             movieId: selectedMovie.value,
//             rating: selectedRating.value,
//         });

//         console.log('Response from postData:', res);

//         // Clear the selected movie and rating after submitting
//         selectedMovie.value = null;
//         selectedRating.value = null;
//     } else {
//         const errorMessage = res.message || 'Unknown error';
//         console.error('Error submitting rating:', errorMessage);
//     }
// };

// Function to fetch movies from backend
// const fetchMovies = async () => {
//     const movieData = await fetchData(mUrl);
//     // Update the movies array with the response
//     movies.value = movieData;
// };

// Hämta betygsatta filmer från backend
// const fetchRatedMovies = async () => {
//     try {
//         const ratedMoviesData = await fetchData(
//             `http://localhost:3000/api/user/ratings/${userId.value}`
//         );
//         // Hämta filmdata från mUrl
//         const allMoviesData = await fetchData(mUrl);

//         // Loopa igenom betygsdata och matcha movieId med filmdata för att få filmtitlar
//         ratedMovies.value = ratedMoviesData.map((ratedMovie) => {
//             const matchedMovie = allMoviesData.find(
//                 (movie) => movie.movieId === ratedMovie.movieId
//             );
//             return {
//                 ...ratedMovie,
//                 movieName: matchedMovie ? matchedMovie.movieName : 'Unknown',
//             };
//         });
//     } catch (error) {
//         console.error('Error fetching rated movies:', error);
//     }
// };

// const updateSelectedRating = () => {
//     if (selectedMovie.value) {
//         selectedRating.value = selectedMovie.value.rating;
//     }
// };

// const updateRating = async () => {
//     if (!selectedRatedMovie) {
//         console.error('No movie selected to update rating');
//         return;
//     }

//     try {
//         // Skapa bodyn för PUT-förfrågan
//         const body = {
//             rating: selectedUpdatedRating.value,
//         };

//         // Update rating in backend
//         await putData(`${rUrl}${selectedRatedMovie.value._id}`, body);

//         // Refresh rated movies list
//         await fetchRatedMovies();

//         // Clear selected rated movie and rating after updating
//         selectedRatedMovie.value = null;
//         selectedUpdatedRating.value = null;
//     } catch (error) {
//         console.error('Error updating rating:', error.message);
//     }
// };

// const deleteRating = async () => {
//     if (!selectedRatedMovie) {
//         console.error('No movie selected to delete rating');
//         return;
//     }

//     try {
//         await deleteData(`${rUrl}${selectedRatedMovie.value._id}`);
//         await fetchRatedMovies();
//         console.log('Rating deleted successfully');
//     } catch (error) {
//         console.error('Error deleting rating:', error.message);
//     }
// };

//call user store action
const handleLogin = async (username, password, router) => {
    try {
        const url = uUrl + 'login';
        const res = await postData(url, {
            userName: username,
            userPassword: password,
        });

        if (res.success) {
            const userId = res.id;
            localStorage.setItem('userId', userId); // Lagra userId lokalt
            router.push({ name: 'UserPage', params: { userId } });
            console.log('Login successful');
        } else {
            console.error('Error logging in:', res.message);
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
    }
};

const handleLogout = () => {
    // Ta bort användarsessionen från localStorage
    localStorage.removeItem('userData');
    // Återställ användarstatus
    isLoggedIn.value = false;
    setResponse({ success: true, message: 'Logged out' });
};
</script>

<template>
    <div class="container">
        <h1 class="movie-section">User Login</h1>

        <p
            v-if="response.success !== null"
            :class="response.success ? 'success-message' : 'error-message'"
        >
            {{ response.message }}
        </p>
        <p v-if="isLoggedIn" class="movie-section">
            Logged in as: {{ userName }}
        </p>
        <form
            v-if="!isLoggedIn"
            @submit.prevent="handleLogin(loginName, loginPassword, router)"
            class="input-section"
        >
            <input type="text" v-model="loginName" class="input-field" />
            <input type="text" v-model="loginPassword" class="input-field" />
            <input
                type="submit"
                :disabled="!loginName || !loginPassword"
                value="Login"
                class="submit-button"
            />
        </form>
        <form v-else @submit.prevent="handleLogout" class="input-section">
            <input type="submit" value="Logout" class="submit-button" />
        </form>

        <!-- Add movie rating form -->
        <!-- <div v-if="isLoggedIn && movies.length > 0" class="movie-section">
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

        <div v-if="isLoggedIn" class="movie-section">
            <h2>Rated Movies</h2>
            <ul>
                <li v-for="movie in ratedMovies" :key="movie.movieId">
                    {{ movie.movieName }} - Rating: {{ movie.rating }}
                </li>
            </ul>
        </div>

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
        </div> -->
    </div>
</template>

<style scoped>
.container {
    background-color: black;
    background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
    height: 100%;
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
