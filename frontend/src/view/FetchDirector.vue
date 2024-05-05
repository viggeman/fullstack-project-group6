<template>
    <div class="container">
        <ul>
            <li v-for="item in directors">
                {{ item.directorName }}: ID {{ item.directorId }}
            </li>
        </ul>

        <div class="section">
            <h1>Post director</h1>
            <p v-if="errors" class="error-message">{{ errors }}</p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <input
                type="text"
                v-model="postInput"
                placeholder="Enter director name"
                class="input-field small-input"
            />
            <button @click="postSubmit" class="submit-button">Submit</button>
        </div>

        <div class="section">
            <h1>Find director movies</h1>
            <select v-model="findDirector" class="select-field">
                <option
                    v-for="item in directors"
                    :key="item.directorId"
                    :value="item.directorId"
                >
                    {{ item.directorName }}
                </option>
            </select>
            <button @click="findSubmit" class="submit-button">Find</button>
            <ul v-if="directorMovies">
                <li v-for="item in directorMovies">
                    {{ item.movieName }}: ID {{ item.movieId }}
                </li>
            </ul>
            <p v-else>No movies found</p>
        </div>

        <div class="section">
            <h1>Delete director</h1>
            <p v-if="errors" class="error-message">{{ errors }}</p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <select v-model="deleteSelected" class="select-field">
                <option
                    v-for="item in directors"
                    :key="item.directorId"
                    :value="item.directorId"
                >
                    {{ item.directorName }}
                </option>
            </select>
            <button @click="deleteSubmit" class="submit-button">Delete</button>
        </div>

        <div class="section">
            <h1>Put director</h1>
            <p v-if="errors" class="error-message">{{ errors }}</p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <select v-model="putSelected" class="select-field">
                <option
                    v-for="item in directors"
                    :key="item.directorId"
                    :value="item.directorId"
                >
                    {{ item.directorName }}
                </option>
            </select>
            <input
                type="text"
                v-model="putNewEntry"
                placeholder="Enter new director name"
                class="input-field small-input"
            />
            <button @click="putSubmit" class="submit-button">Update</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';

const dUrl = 'http://localhost:3000/api/directors/';
const mUrl = 'http://localhost:3000/api/movies/';

const id = ref(null);
const postInput = ref('');
const putSelected = ref(null);
const directors = ref(null);
const movies = ref(null);
const errors = ref(null);
const response = ref({
    success: null,
    message: '',
});
const putNewEntry = ref('');
const deleteSelected = ref(null);
const findDirector = ref(null);
const directorMovies = ref(null);

// Methods
onMounted(async () => {
    directors.value = await fetchData(dUrl);
    movies.value = await fetchData(mUrl);
});

const setResponse = (data, msg) => {
    response.value = {
        success: data.success,
        message: msg ? `${msg}: ${data.message}` : data.message,
    };

    setTimeout(() => {
        response.value = {
            success: null,
            message: '',
        };
    }, 5000);
};

const setErrors = (msg) => {
    errors.value = msg;
    setTimeout(() => {
        errors.value = null;
    }, 5000);
};

// Submit methods
const postSubmit = async () => {
    if (postInput.value.trim() === '') {
        setErrors('Please enter a name');
        return;
    }
    const data = await postData(dUrl, { directorName: postInput.value });
    if (data.success) {
        setResponse(data, postInput.value);
        directors.value = await fetchData(dUrl);
        postInput.value = '';
    } else {
        setResponse(data);
    }
};

const findSubmit = () => {
    if (findDirector.value === null) {
        setErrors('Please select a name');
        return;
    }
    const match = movies.value.filter(
        (item) => item.directorDId === findDirector.value
    );
    return (directorMovies.value = match);
};

const putSubmit = async () => {
    if (putNewEntry.value.trim() === '' || putSelected.value === null) {
        setErrors('Please select a name');
        return;
    }
    id.value = putSelected.value;
    putNewEntry.value = putNewEntry.value;
    const data = await putData(dUrl, {
        id: id.value,
        directorName: putNewEntry.value,
    });
    if (data.success) {
        putNewEntry.value = '';
        setResponse(data, data.name);
        directors.value = await fetchData(dUrl);
    } else {
        setResponse(data);
    }
};

const deleteSubmit = async () => {
    if (deleteSelected.value === null) {
        setErrors('Please select a name');
        return;
    }

    id.value = deleteSelected.value;
    const removed = directors.value.find(
        (item) => item.directorId === id.value
    ).directorName;

    const data = await deleteData(dUrl, { id: id.value });
    if (data.success) {
        deleteSelected.value = null;
        setResponse(data, removed);
        directors.value = await fetchData(dUrl);
    } else {
        setResponse(data);
    }
};
</script>

<style scoped>
/* Your component's CSS styles go here */
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

.section {
    padding: 1rem 0;
}

.input-field,
.select-field {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #fff;
    background-color: #000;
    color: #fff;
    width: 50%;
    font-family: Inconsolata, monospace;
}

.small-input {
    width: 50%;
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
