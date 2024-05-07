<script setup>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
  import { useUserStore } from '../stores/userStore.js';
  import {
    fetchData,
    postData,
    putData,
    deleteData,
  } from '../services/crud.js';

  const uUrl = 'http://localhost:3000/api/user/';
  const mUrl = 'http://localhost:3000/api/movies/';
  const favMurl = 'http://localhost:3000/api/favorite-movies/';
  const uId = ref(null);
  const isLoggedIn = ref(false);
  const userName = ref('');
  const userStore = useUserStore();
  const favMoviesLists = ref([]);
  const movieNames = ref([]);

  const newListTitle = ref('');
  const selectedMovies = ref([]);
  const editMode = ref({
    status: false,
    id: null,
  });
  const changeListTitle = ref('');

  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    console.log('userdata', userData);
    isLoggedIn.value = userData.isLoggedIn;
    uId.value = userData.userId;
    userName.value = userData.userName;
  }

  userStore.$subscribe(() => {
    isLoggedIn.value = userStore.isLoggedIn;
    console.log(isLoggedIn.value);
  });

  onMounted(async () => {
    if (isLoggedIn.value) {
      favMoviesLists.value = await fetchData(favMurl + uId.value);
      console.log('favMoviesLists', favMoviesLists.value);
      const movies = await fetchMovieNames();
      console.log('movies', movies);
      movieNames.value = movies;
    }
  });

  const fetchMovieNames = async () => {
    const movieData = await fetchData(mUrl);
    const movieNames = [];
    movieData.forEach((movie) => {
      movieNames.push({ name: movie.movieName, id: movie.movieId });
    });
    return movieNames;
  };

  const handleLogout = () => {
    userStore.logout();
    isLoggedIn.value = false;
  };

  const createFavoriteList = async () => {
    const movies = selectedMovies.value.map((movieId) => {
      return { movieId };
    });
    console.log('moviesPist', movies);
    const res = await postData(favMurl, {
      userId: uId.value,
      favoriteListTitle: newListTitle.value,
      movies: movies,
    });

    console.log('res', res);

    if (res) {
      favMoviesLists.value = await fetchData(favMurl + uId.value);
      selectedMovies.value = [];
      newListTitle.value = '';
    } else {
      console.log('Error creating favorite list');
    }
  };

  const deleteFavoriteList = async (listId) => {
    const res = await deleteData(favMurl + listId);
    console.log('Favorite list deleted', listId);
    if (res) {
      favMoviesLists.value = await fetchData(favMurl + uId.value);
    } else {
      console.log('Error deleting favorite list');
    }
  };

  const changeFavoriteList = async (listId, newTitle) => {
    const res = await putData(favMurl + listId, {
      favoriteListTitle: newTitle,
    });
    console.log('res', res);
    if (res) {
      editMode.value = {
        status: false,
        id: null,
      };
      favMoviesLists.value = await fetchData(favMurl + uId.value);
    } else {
      console.log('Error updating favorite list');
    }
  };

  const toggleEdit = (listId) => {
    editMode.value.status = !editMode.value.status;
    editMode.value.id = listId;
    console.log('editMode', editMode.value);
  };
</script>

<template>
  <div class="container">
    <h1>User Page</h1>
    <p v-if="isLoggedIn">Logged in as: {{ userName }}</p>
    <p v-else>Not logged in</p>
    <div class="add-fav-movie">
      <form v-if="isLoggedIn" @submit.prevent="createFavoriteList">
        <h2>Create a favorite list</h2>
        <input type="text" v-model="newListTitle" />
        <div>
          <p>Select movies:</p>
          <label v-for="movie in movieNames" :key="movie.id">
            <input type="checkbox" v-model="selectedMovies" :value="movie.id" />
            {{ movie.name }}
          </label>
        </div>
        <input type="submit"></input>
      </form>
    </div>
    <div class="fav-grid" v-if="favMoviesLists">
      <div class="fav-movie-list" v-for="item in favMoviesLists" :id="item._id">
        <div class="fav-movie-title">
          <h2>{{ item.favoriteListTitle }}</h2>
          <input v-if="editMode.status && item._id === editMode.id" type="text" v-model="changeListTitle" />
          <div>
            <button class="delete-button" @click.prevent="deleteFavoriteList(item._id)">Delete</button>
            <button class="delete-button" @click="toggleEdit(item._id)">Change</button>
            <button v-if="editMode.status && item._id === editMode.id" class="delete-button" @click.prevent="changeFavoriteList(item._id, changeListTitle)">Update</button>
          </div>
        </div>

        <ul class="fav-list">
          <h2>Movies</h2>
          <li v-for="movie in item.movies">
            {{ movie.movieId }}
          </li>
        </ul>
      </div>
    </div>
    <form @submit.prevent="handleLogout">
        <input type="submit" value="Logout" />
      </form>
  </div>
</template>

<style scoped>
  .container {
    background-color: black;
    background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
    min-height: 100vh;
    margin: 0;
    padding: 2rem;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
    color: white;
  }
  p {
    font-size: 16px;
    margin-bottom: 5px;
    color: white;
  }
  input[type='text'],
  select {
    margin-bottom: 10px;
    padding: 5px;
    width: 200px;
  }
  input[type='checkbox'] {
    margin-right: 5px;

  }
  input[type='submit'] {
    margin-top: 1rem;
    padding: 5px 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  input[type='submit']:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }

  .delete-button {
    background-color: none;
    color: red;
    border: none;
    cursor: pointer;
  }

  .fav-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
  }
  .add-fav-movie {
    padding: 2rem;
    margin-top: 20px;
    max-width: 50%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .fav-movie-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 2rem;
    padding: 2rem;
    margin-right: 2rem;
    margin-top: 20px;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .fav-movie-title {
    margin-right: 2rem;
  }

  .fav-list {
    list-style-type: none;
    padding: 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
