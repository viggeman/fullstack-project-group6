<script setup>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
  import {
    fetchData,
    postData,
    putData,
    deleteData,
  } from '../services/crud.js';
  // import ListComponent from '../components/ListComponent.vue';

  const wUrl = 'http://localhost:3000/api/writers/';
  const mUrl = 'http://localhost:3000/api/movies/';

  const id = ref(null);
  const postInput = ref('');
  const putSelected = ref(null);
  const writers = ref(null);
  const movies = ref(null);
  const errors = ref(null);
  const response = ref({
    success: null,
    message: '',
  });
  const putNewEntry = ref('');
  const deleteSelected = ref(null);
  const findWriter = ref(null);
  const writerMovies = ref(null);

  // Methods
  onMounted(async () => {
    writers.value = await fetchData(wUrl);
    movies.value = await fetchData(mUrl);
  });

  // const updateData = async () => {
  //   const data = await fetchData(wUrl);
  //   console.log('data', data);
  //   return data;
  // };

  const setResponse = (data, msg) => {
    console.log('data setres', data);
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
    const data = await postData(wUrl, { writerName: postInput.value });
    if (data.success) {
      setResponse(data, postInput.value);
      writers.value = await fetchData(wUrl);
      postInput.value = '';
    } else {
      setResponse(data);
    }
  };

  const findSubmit = () => {
    console.log('findWriter', findWriter.value);
    if (findWriter.value === null) {
      setErrors('Please select a name');
      return;
    }
    const match = movies.value.filter(
      (item) => item.writerWId === findWriter.value
    );
    console.log('writerMovies', match);
    return (writerMovies.value = match);
  };

  const putSubmit = async () => {
    if (putNewEntry.value.trim() === '' || putSelected.value === null) {
      setErrors('Please select a name');
      return;
    }
    id.value = putSelected.value;
    putNewEntry.value = putNewEntry.value;
    const data = await putData(wUrl, {
      id: id.value,
      writerName: putNewEntry.value,
    });
    if (data.success) {
      putNewEntry.value = '';
      setResponse(data, data.name);
      writers.value = await fetchData(wUrl);
    } else {
      console.log('data', data);
      setResponse(data);
    }
  };

  const deleteSubmit = async () => {
    console.log('deleteSelected', deleteSelected.value);
    if (deleteSelected.value === null) {
      setErrors('Please select a name');
      return;
    }

    id.value = deleteSelected.value;
    const removed = writers.value.find(
      (item) => item.writerId === id.value
    ).writerName;

    const data = await deleteData(wUrl, { id: id.value });
    if (data.success) {
      deleteSelected.value = null;
      setResponse(data, removed);
      writers.value = await fetchData(wUrl);
    } else {
      setResponse(data);
    }
  };
</script>

<template>
  <div class="container">
    <ul>
      <li v-for="item in writers">
        {{ item.writerName }}: ID {{ item.writerId }}
      </li>
    </ul>

    <div style="border: 1px solid black">
      <h1>Post writer</h1>
      <p v-if="errors" style="color: red">{{ errors }}</p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <p v-else-if="!response.success">{{ response.message }}</p>
      <input type="text" v-model="postInput" />
      <input type="submit" @click="postSubmit" />
    </div>

    <div style="border: 1px solid black">
      <h1>Find writer movies</h1>
      <select v-model="findWriter">
        <option
          v-for="items in writers"
          :key="items.writerId"
          :value="items.writerId"
        >
          {{ items.writerName }}
        </option>
      </select>
      <input type="submit" @click="findSubmit" />
      <ul v-if="writerMovies">
        <li v-for="item in writerMovies">
          {{ item.movieName }}: ID {{ item.movieId }}
        </li>
      </ul>
      <p v-else>No movies found</p>
    </div>

    <div style="border: 1px solid black">
      <h1>Delete writer</h1>
      <p v-if="errors" style="color: red">
        {{ errors }}
      </p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <p v-else-if="!response.success">{{ response.message }}</p>
      <select v-model="deleteSelected">
        <option
          v-for="items in writers"
          :key="items.writerId"
          :value="items.writerId"
        >
          {{ items.writerName }}
        </option>
      </select>
      <input disabled type="text" v-model="deleteSelected" />
      <input type="submit" @click="deleteSubmit" />
    </div>
    <div style="border: 1px solid black">
      <h1>Put writer</h1>
      <p v-if="errors" style="color: red">{{ errors }}</p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <p v-else-if="!response.success">{{ response.message }}</p>
      <select v-model="putSelected">
        <option
          v-for="items in writers"
          :key="items.writerId"
          :value="items.writerId"
        >
          {{ items.writerName }}
        </option>
      </select>
      <input type="text" v-model="putNewEntry" />
      <input type="submit" @click="putSubmit" />
    </div>
  </div>
</template>

<style scoped>
  /* Your component's CSS styles go here */
  .container {
    background-color: black;
    background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
    height: 100vh;
    margin: 0;
    overflow: hidden;
    padding: 2rem;
    position: relative;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    margin-bottom: 5px;
  }
  input[type='text'],
  select {
    margin-bottom: 10px;
    padding: 5px;
    width: 200px;
  }
  input[type='submit'] {
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

  /* Your component's CSS styles go here */

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    margin-bottom: 5px;
  }

  input[type='text'],
  select {
    margin-bottom: 10px;
    padding: 5px;
    width: 200px;
  }

  input[type='submit'] {
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
</style>
