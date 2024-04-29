<script setup>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
  import {
    fetchData,
    postData,
    putData,
    deleteData,
  } from '../services/crud.js';
  import ListComponent from '../components/ListComponent.vue';
  // import TestComponent from '../components/TestComponent.vue';

  const url = 'http://localhost:3000/api/writers/';
  const id = ref(null);
  const postInput = ref('');
  const putSelected = ref(null);
  const getData = ref(null);
  const errors = ref(null);
  const response = ref({
    success: null,
    message: '',
  });
  const putNewEntry = ref('');
  const deleteSelected = ref(null);

  const fetchDataAsync = async () => {
    getData.value = await fetchData(url);
    console.log('getData', getData.value);
  };

  const { data: testData } = fetchData(url);
  console.log('testData', testData);
  onMounted(fetchDataAsync);

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

  const postSubmit = async () => {
    if (postInput.value.trim() === '') {
      setErrors('Please enter a name');
      return;
    }
    const data = await postData(url, { writerName: postInput.value });
    if (data.success) {
      setResponse(data, postInput.value);
      fetchDataAsync();
      postInput.value = '';
    } else {
      setResponse(data);
    }
  };

  const putSubmit = async () => {
    if (putNewEntry.value.trim() === '' || putSelected.value === null) {
      setErrors('Please select a name');
      return;
    }
    id.value = putSelected.value;
    putNewEntry.value = putNewEntry.value;
    const data = await putData(url, {
      id: id.value,
      writerName: putNewEntry.value,
    });
    if (data.success) {
      putNewEntry.value = '';
      setResponse(data, data.name);
      fetchDataAsync();
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
    const removed = getData.value.find(
      (item) => item.writerId === id.value
    ).writerName;

    const data = await deleteData(url, { id: id.value });
    if (data.success) {
      deleteSelected.value = null;
      setResponse(data, removed);
      fetchDataAsync();
    } else {
      setResponse(data);
    }
  };
</script>

<template>
  <div>
    <ListComponent :items="getData" />
    <!-- <h1 v-for="items in getData">
      {{ items.writerName }} + ID {{ items.writerId }}
    </h1> -->
    <div style="border: 1px solid black">
      <h1>Post writer</h1>
      <p v-if="errors" style="color: red">{{ errors }}</p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <p v-else-if="!response.success">{{ response.message }}</p>
      <input type="text" v-model="postInput" />
      <input type="submit" @click="postSubmit" />
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
          v-for="items in getData"
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
          v-for="items in getData"
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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
</style>

<style scoped>
  /* Your component's CSS styles go here */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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
</style>
