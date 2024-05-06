<template>
    <div class="container">
        <div class="movie-section">
            <h1 v-for="item in getMovieData" :key="item.movieId">
                {{ item.movieName }} (ID: {{ item.movieId }})
            </h1>
        </div>

        <div class="movie-section">
            <h2>Add movie</h2>
            <form @submit.prevent="submitForm" class="input-section">
                <input
                    type="text"
                    v-model="movieName"
                    placeholder="Enter movie title"
                    required
                    class="input-field"
                    :class="{ error: movieName === '' }"
                />

                <select
                    v-model="selectedDirector"
                    class="select-field"
                    :class="{ error: selectedDirector === '' }"
                >
                    <option disabled value="">Choose director</option>
                    <option
                        v-for="director in getDirectorData"
                        :key="director.directorId"
                        :value="director.directorId"
                    >
                        {{ director.directorName }}
                    </option>
                    <option value="new">Add new director</option>
                </select>

                <div v-if="selectedDirector === 'new'">
                    <input
                        type="text"
                        v-model="newDirectorName"
                        placeholder="Enter name"
                        class="input-field"
                        :class="{ error: newDirectorName === '' }"
                    />
                </div>

                <select
                    v-model="selectedWriter"
                    class="select-field"
                    :class="{ error: selectedWriter === '' }"
                >
                    <option disabled value="">Choose writer</option>
                    <option
                        v-for="writer in getWriterData"
                        :key="writer.writerId"
                        :value="writer.writerId"
                    >
                        {{ writer.writerName }}
                    </option>
                    <option value="new">Add new writer</option>
                </select>

                <div v-if="selectedWriter === 'new'">
                    <input
                        type="text"
                        v-model="newWriterName"
                        placeholder="Enter name"
                        class="input-field"
                        :class="{ error: newWriterName === '' }"
                    />
                </div>

                <select
                    v-model="selectedGenre"
                    class="select-field"
                    :class="{ error: selectedGenre === '' }"
                >
                    <option disabled value="">Choose genre</option>
                    <option
                        v-for="genre in getGenreData"
                        :key="genre.genreId"
                        :value="genre.genreId"
                    >
                        {{ genre.genreName }}
                    </option>
                    <option value="new">Add new genre</option>
                </select>

                <div v-if="selectedGenre === 'new'">
                    <input
                        type="text"
                        v-model="newGenreName"
                        placeholder="Enter genre"
                        class="input-field"
                        :class="{ error: newGenreName === '' }"
                    />
                </div>

                <select
                    v-model="selectedActor"
                    class="select-field"
                    :class="{ error: selectedActor === '' }"
                >
                    <option disabled value="">Choose actor</option>
                    <option
                        v-for="actor in getActorData"
                        :key="actor.actorId"
                        :value="actor.actorId"
                    >
                        {{ actor.actorName }}
                    </option>
                    <option value="new">Add new actor</option>
                </select>

                <div v-if="selectedActor === 'new'">
                    <input
                        type="text"
                        v-model="newActorName"
                        placeholder="Enter name"
                        class="input-field"
                        :class="{ error: newActorName === '' }"
                    />
                </div>

                <button
                    type="submit"
                    class="submit-button"
                    :disabled="!isFormValid"
                >
                    Submit
                </button>
            </form>
        </div>

        <div class="movie-section">
            <h2>Update movie</h2>
            <form @submit.prevent="updateForm" class="input-section">
                <select v-model="selectedMovieId" class="select-field">
                    <option disabled value="">Choose movie</option>
                    <option
                        v-for="movie in getMovieData"
                        :key="movie.movieId"
                        :value="movie.movieId"
                    >
                        {{ movie.movieName }} (ID: {{ movie.movieId }})
                    </option>
                </select>

                <input
                    type="text"
                    v-model="updatedMovieName"
                    placeholder="Enter new movie title"
                    class="input-field"
                />

                <select v-model="updatedWriterId" class="select-field">
                    <option disabled value="">Choose writer</option>
                    <option
                        v-for="writer in getWriterData"
                        :key="writer.writerId"
                        :value="writer.writerId"
                    >
                        {{ writer.writerName }}
                    </option>
                    <option value="new">Add new writer</option>
                </select>

                <div v-if="updatedWriterId === 'new'">
                    <input
                        type="text"
                        v-model="newUpdatedWriterName"
                        placeholder="Enter writer name"
                        class="input-field"
                    />
                </div>

                <button type="submit" class="submit-button">Update</button>
            </form>
        </div>

        <div class="movie-section">
            <h1>Delete movie</h1>
            <div class="input-section">
                <select v-model="deleteSelected" class="select-field">
                    <option disabled value="">Choose movie</option>
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
import { ref, onMounted, computed } from 'vue';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';

export default {
    name: 'Fetchmovie',
    setup() {
        const Murl = 'http://localhost:3000/api/movies/';
        const Wurl = 'http://localhost:3000/api/writers/';
        const MaMurl = 'http://localhost:3000/api/movie-actors/movie/';
        const Maurl = 'http://localhost:3000/api/movie-actors/';
        const Gurl = 'http://localhost:3000/api/genres/';
        const Durl = 'http://localhost:3000/api/directors/';
        const Aurl = 'http://localhost:3000/api/actors/';
        const MAurl = 'http://localhost:3000/api/movie-actors/';

        const getMovieData = ref(null);
        const getWriterData = ref(null);
        const getGenreData = ref(null);
        const getDirectorData = ref(null);
        const getActorData = ref(null);
        const movieName = ref('');
        const selectedWriter = ref('');
        const selectedGenre = ref('');
        const selectedDirector = ref('');
        const selectedActor = ref('');
        const deleteSelected = ref('');
        const newWriterName = ref('');
        const newGenreName = ref('');
        const newDirectorName = ref('');
        const newActorName = ref('');

        const selectedMovieId = ref('');
        const updatedMovieName = ref('');
        const updatedWriterId = ref('');
        const updatedGenreId = ref('');
        const updatedDirectorId = ref('');
        const updatedActorId = ref('');
        const newUpdatedWriterName = ref('');
        const newUpdatedGenreName = ref('');
        const newUpdatedDirectorName = ref('');
        const newUpdatedActorName = ref('');

        const fetchDataAsync = async () => {
            getMovieData.value = await fetchData(Murl);
            getWriterData.value = await fetchData(Wurl);
            getGenreData.value = await fetchData(Gurl);
            getDirectorData.value = await fetchData(Durl);
            getActorData.value = await fetchData(Aurl);
        };

        onMounted(fetchDataAsync);

        // Computed property to check if the form is valid
        const isFormValid = computed(() => {
            return (
                movieName.value.trim() !== '' &&
                selectedDirector.value !== '' &&
                selectedWriter.value !== '' &&
                selectedActor.value !== '' &&
                selectedGenre.value !== ''
                // Lägg till andra villkor för fälten här om det behövs
            );
        });

        const submitForm = async () => {
            let writerIdToUse = selectedWriter.value;
            let genreIdToUse = selectedGenre.value;
            let directorIdToUse = selectedDirector.value;
            let actorIdToUse = selectedActor.value;

            // Skapa en ny författare om det är valt
            if (selectedWriter.value === 'new') {
                const writerData = await postData(Wurl, {
                    writerName: newWriterName.value,
                });

                if (writerData.success) {
                    writerIdToUse = writerData.writerWId;
                } else {
                    // Hantera fel om författaren inte kunde skapas
                    console.error('Failed to create new writer');
                    return;
                }
            }

            // Skapa en ny genre om det är valt
            if (selectedGenre.value === 'new') {
                const genreData = await postData(Gurl, {
                    genreName: newGenreName.value,
                });

                if (genreData.success) {
                    genreIdToUse = genreData.genreGId;
                } else {
                    // Hantera fel om genren inte kunde skapas
                    console.error('Failed to create new genre');
                    return;
                }
            }

            // Skapa en ny director om det är valt
            if (selectedDirector.value === 'new') {
                const directorData = await postData(Durl, {
                    directorName: newDirectorName.value,
                });

                if (directorData.success) {
                    directorIdToUse = directorData.directorDId;
                } else {
                    // Hantera fel om direktören inte kunde skapas
                    console.error('Failed to create new director');
                    return;
                }
            }

            // Skapa en ny actor om det är valt
            if (selectedActor.value === 'new') {
                const actorData = await postData(Aurl, {
                    actorName: newActorName.value,
                });

                if (actorData.success) {
                    actorIdToUse = actorData.actorId;
                } else {
                    // Hantera fel om actor inte kunde skapas
                    console.error('Failed to create new actor');
                    return;
                }
            }

            // Posta filmen med den valda eller nyss skapade författaren, genren och direktören
            const movieData = await postData(Murl, {
                movieName: movieName.value,
                writerWId: writerIdToUse,
                genreGId: genreIdToUse,
                directorDId: directorIdToUse,
            });

            // Hantera svar för film-post
            if (movieData.success) {
                const movieId = movieData.movieId;

                // Lägg till skådespelare till filmen med det nya film-ID
                const actorMovieBody = {
                    movieMId: movieId,
                    actorAId: actorIdToUse,
                };

                const actorMovieData = await postData(MAurl, actorMovieBody);

                // Uppdatera getMovieData med den nya filmen
                getMovieData.value = await fetchData(Murl);

                // Återställ input-fälten
                movieName.value = '';
                selectedWriter.value = '';
                newWriterName.value = '';
                selectedGenre.value = '';
                newGenreName.value = '';
                selectedDirector.value = '';
                newDirectorName.value = '';
                selectedActor.value = '';
                newActorName.value = '';
            } else {
                // Hantera fel om filmen inte kunde postas
                console.error('Failed to post movie');
            }
        };

        const updateForm = async () => {
            // Hämta vald film baserat på dess ID
            const selectedMovie = getMovieData.value.find(
                (movie) => movie.movieId === selectedMovieId.value
            );

            // Kontrollera om en film har valts
            if (!selectedMovie) {
                console.error('No movie selected for update');
                return;
            }

            // Uppdatera filmtitel om den nya filmtiteln inte är tom
            if (updatedMovieName.value.trim() !== '') {
                selectedMovie.movieName = updatedMovieName.value.trim();
            }

            let writerIdToUse = updatedWriterId.value;

            // Om en ny writer ska läggas till
            if (updatedWriterId.value === 'new') {
                // Skapa en ny författare
                const writerData = await postData(Wurl, {
                    writerName: newUpdatedWriterName.value,
                });

                if (writerData.success) {
                    writerIdToUse = writerData.writerWId;
                } else {
                    // Hantera fel om författaren inte kunde skapas
                    console.error('Failed to create new writer');
                    return;
                }
            } else if (updatedWriterId.value !== '') {
                // Använd befintlig writerWId om ingen ny writer valts
                writerIdToUse = updatedWriterId.value;
            }

            // Uppdatera writerWId för vald film om en writer har valts
            selectedMovie.writerWId = writerIdToUse;

            // Uppdatera filmen i databasen
            const updatedMovieData = await putData(Murl, {
                id: selectedMovie.movieId,
                movieName: selectedMovie.movieName,
                movieReleaseYear: selectedMovie.movieReleaseYear,
                imdbId: selectedMovie.imdbId,
                genreGId: selectedMovie.genreGId,
                writerWId: selectedMovie.writerWId,
                directorDId: selectedMovie.directorDId,
            });

            if (updatedMovieData.success) {
                // Uppdatera getMovieData med den uppdaterade filmen
                getMovieData.value = await fetchData(Murl);

                // Återställ formuläret
                selectedMovieId.value = '';
                updatedMovieName.value = '';
                updatedWriterId.value = '';
                newUpdatedWriterName.value = '';
            } else {
                // Hantera fel om filmen inte kunde uppdateras
                console.error('Failed to update movie');
            }
        };

        const deleteSubmit = async () => {
            // Hämta id för den valda filmen
            const movieIdToDelete = deleteSelected.value;

            if (movieIdToDelete === null) {
                errors.value.deleteError = 'Please select a movie';
                console.log(errors.value.deleteError);
                return errors.value.deleteError;
            }

            // Hämta den valda filmen från getMovieData
            const selectedMovie = getMovieData.value.find(
                (movie) => movie.movieId === movieIdToDelete
            );

            // Kontrollera om den valda filmen har en kopplad författare
            if (selectedMovie.writerWId) {
                // Om filmen har en kopplad författare, ta bort författaren först
                const writerDeleteResult = await putData(Murl, {
                    id: movieIdToDelete,
                    writerWId: null,
                });

                if (!writerDeleteResult.success) {
                    // Hantera fel om författaren inte kunde tas bort
                    console.log('Failed to delete associated writer');
                    return;
                }
            }

            // Kontrollera och ta bort koppling för genreGId
            if (selectedMovie.genreGId) {
                const genreDeleteResult = await putData(Murl, {
                    id: movieIdToDelete,
                    genreGId: null,
                });

                if (!genreDeleteResult.success) {
                    console.log('Failed to delete associated genre');
                    return;
                }
            }

            // Kontrollera och ta bort koppling för directorDId
            if (selectedMovie.directorDId) {
                const directorDeleteResult = await putData(Murl, {
                    id: movieIdToDelete,
                    directorDId: null,
                });

                if (!directorDeleteResult.success) {
                    console.log('Failed to delete associated director');
                    return;
                }
            }

            // Kontrollera och ta bort kopplingar mellan skådespelare och film
            const actorMovieConnections = await fetchData(
                `${MaMurl}${movieIdToDelete}`
            );

            if (actorMovieConnections.length > 0) {
                // Om det finns kopplingar, loopa igenom och ta bort dem en efter en
                for (const connection of actorMovieConnections) {
                    const deleteConnectionResult = await deleteData(Maurl, {
                        movieMId: connection.movieMId,
                        actorAId: connection.actorAId,
                    });

                    if (!deleteConnectionResult.success) {
                        // Hantera fel om kopplingen inte kunde tas bort
                        console.log('Failed to delete actor-movie connection');
                        return;
                    }
                }
            }

            // Ta bort filmen efter att författaren har tagits bort (om den hade en kopplad författare)
            const movieDeleteResult = await deleteData(Murl, {
                id: movieIdToDelete,
            });

            if (movieDeleteResult.success) {
                // Uppdatera getMovieData efter att filmen har tagits bort
                getMovieData.value = await fetchData(Murl);

                // Återställ deleteSelected
                deleteSelected.value = null;
            } else {
                // Hantera fel om filmen inte kunde tas bort
                console.log('Failed to delete movie');
            }
        };

        return {
            // Your component's data, methods, and computed properties go here
            getMovieData,
            getWriterData,
            getGenreData,
            getDirectorData,
            getActorData,
            movieName,
            selectedWriter,
            selectedGenre,
            selectedDirector,
            selectedActor,
            newWriterName,
            newGenreName,
            newDirectorName,
            newActorName,
            submitForm,
            deleteSubmit,
            deleteSelected,
            selectedMovieId,
            updatedMovieName,
            updatedWriterId,
            updatedDirectorId,
            updatedActorId,
            newUpdatedWriterName,
            newUpdatedDirectorName,
            newUpdatedActorName,
            updateForm,
            isFormValid,
        };
    },
};
</script>

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
    width: 50rem;
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
