<template>
    <div class="container">
        <div class="actor-section">
            <h1>Show actor's movies</h1>
            <p v-if="errors.deleteError" class="error-message">
                {{ errors.deleteError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <select v-model="selectedActorId" class="select-field">
                <option disabled value="">Select an actor</option>
                <option
                    v-for="actor in getActorData"
                    :key="actor.actorId"
                    :value="actor.actorId"
                >
                    {{ actor.actorName }} (ID: {{ actor.actorId }})
                </option>
            </select>
            <div
                class="actor-section"
                v-if="selectedActorId !== '' && actorMovies"
            >
                <h2>Movies featuring {{ getActorName(selectedActorId) }}</h2>
                <ul>
                    <li
                        v-if="actorMovies.length > 0"
                        v-for="movie in actorMovies"
                        :key="movie.movieId"
                    >
                        {{ movie.movieName }}
                    </li>
                    <li v-else>No movies found</li>
                </ul>
            </div>
        </div>

        <div class="actor-section">
            <h1>Put actor in a movie</h1>
            <p v-if="errors.postError" class="error-message">
                {{ errors.postError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <div class="input-section">
                <select v-model="postActorInput" class="select-field">
                    <option disabled value="">Select an actor</option>
                    <option
                        v-for="item in getActorData"
                        :key="item.actorId"
                        :value="item.actorId"
                    >
                        {{ item.actorName }} (ID: {{ item.actorId }})
                    </option>
                </select>
                <select v-model="postMovieInput" class="select-field">
                    <option disabled value="">Select a movie</option>
                    <option
                        v-for="item in getMovieData"
                        :key="item.movieId"
                        :value="item.movieId"
                    >
                        {{ item.movieName }} (ID: {{ item.movieId }})
                    </option>
                </select>
                <button @click="postSubmit" class="submit-button">Add</button>
            </div>
        </div>
        <div class="actor-section">
            <h1>Delete actor from a movie</h1>
            <p v-if="errors.deleteError" class="error-message">
                {{ errors.deleteError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <div class="input-section">
                <select v-model="deleteActorSelected" class="select-field">
                    <option disabled value="">Select an actor</option>
                    <option
                        v-for="item in getActorData"
                        :key="item.actorId"
                        :value="item.actorId"
                    >
                        {{ item.actorName }} (ID: {{ item.actorId }})
                    </option>
                </select>
                <select v-model="deleteMovieSelected" class="select-field">
                    <option disabled value="">Select a movie</option>
                    <option
                        v-for="item in getMovieData"
                        :key="item.movieId"
                        :value="item.movieId"
                    >
                        {{ item.movieName }} (ID: {{ item.movieId }})
                    </option>
                </select>
                <button @click="deleteSubmit" class="submit-button">
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';

export default {
    name: 'Fetchactor',
    setup() {
        const url = 'http://localhost:3000/api/movie-actors/';
        const urlMovie = 'http://localhost:3000/api/movies/';
        const urlActor = 'http://localhost:3000/api/actors/';

        const selectedActorId = ref('');
        const postActorInput = ref('');
        const postMovieInput = ref('');
        const getMovieData = ref(null);
        const getActorData = ref(null);
        const actorMovies = ref(null);

        const errors = ref({
            postError: '',
            getError: '',
            putError: '',
            deleteError: '',
        });
        const response = ref({
            success: null,
            message: '',
        });
        const deleteActorSelected = ref('');
        const deleteMovieSelected = ref('');

        const fetchActorMovies = async () => {
            if (selectedActorId.value) {
                try {
                    const actorMoviesData = await fetchData(
                        `${url}actor/${selectedActorId.value}`
                    );
                    actorMovies.value = actorMoviesData.map((movieData) => {
                        const movieId = movieData.movieMId;
                        const movie = getMovieData.value.find(
                            (movie) => movie.movieId === movieId
                        );
                        return {
                            movieId: movie.movieId,
                            movieName: movie.movieName,
                        };
                    });
                } catch (error) {
                    console.error('Error fetching actor movies:', error);
                    actorMovies.value = [];
                }
            }
        };

        watch(selectedActorId, () => {
            fetchActorMovies();
        });

        const fetchDataAsync = async () => {
            getMovieData.value = await fetchData(urlMovie);
            getActorData.value = await fetchData(urlActor);
        };
        fetchDataAsync();

        const getActorName = (actorId) => {
            const actor = getActorData.value.find(
                (actor) => actor.actorId === actorId
            );
            return actor ? actor.actorName : '';
        };

        const postSubmit = async () => {
            if (postActorInput.value === '' || postMovieInput.value === '') {
                errors.value.postError = 'Please select both Actor and Movie';
                console.log(errors.value.postError);
                return errors.value.postError;
            }

            const requestBody = {
                movieMId: postMovieInput.value,
                actorAId: postActorInput.value,
            };

            const dataPost = await postData(url, requestBody);

            if (dataPost.success) {
                postActorInput.value = '';
                postMovieInput.value = '';
                response.value = {
                    success: dataPost.success,
                    message: dataPost.message,
                };
                errors.value.postError = '';
                fetchDataAsync();
                fetchActorMovies();
                console.log('dataPost', dataPost);
                return dataPost;
            } else {
                response.value = {
                    success: dataPost.success,
                    message: dataPost.message,
                };
                errors.value.postError = '';
                return dataPost;
            }
        };

        const deleteSubmit = async () => {
            if (!deleteActorSelected.value || !deleteMovieSelected.value) {
                errors.value.deleteError =
                    'Please select both actor and movie.';
                return;
            }

            const requestBody = {
                movieMId: deleteMovieSelected.value,
                actorAId: deleteActorSelected.value,
            };

            const deleteResponse = await deleteData(url, requestBody);

            if (deleteResponse.success) {
                deleteActorSelected.value = '';
                deleteMovieSelected.value = '';
                response.value = {
                    success: deleteResponse.success,
                    message: deleteResponse.message,
                };
                errors.value.deleteError = '';
                fetchActorMovies();
                fetchDataAsync(); // Uppdatera datan efter borttagning
                console.log('deleteResponse', deleteResponse);
            } else {
                response.value = {
                    success: deleteResponse.success,
                    message: deleteResponse.message,
                };
                errors.value.deleteError = deleteResponse.message;
            }
        };

        return {
            // Dina komponentdata, metoder och beräknade egenskaper går här
            getActorData,
            getMovieData,
            actorMovies,
            getActorName,
            postActorInput,
            postMovieInput,
            errors,
            response,
            deleteActorSelected,
            deleteMovieSelected,
            postSubmit,
            deleteSubmit,
            selectedActorId,
        };
    },
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

.actor-section {
    padding: 10px;
}

.actor-section h1 {
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
    width: 50%;
    font-family: Inconsolata, monospace; /* Tillämpa samma font som på resten av komponenten */
}

.small-input {
    width: 50%;
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
