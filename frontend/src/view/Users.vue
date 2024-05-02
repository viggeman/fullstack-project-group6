<script setup>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
  import {
    fetchData,
    postData,
    putData,
    deleteData,
  } from '../services/crud.js';

  const uUrl = 'http://localhost:3000/api/users/';
  const uId = ref(null);
  const users = ref(null);
  const errors = ref(null);
  const response = ref({
    success: null,
    message: '',
  });
  const addForm = {
    name: ref(''),
    password: ref(''),
  };

  // Methods
  onMounted(async () => {
    users.value = await fetchData(uUrl);
    console.log('users', users.value);
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

  const addUser = async () => {
    const data = {
      userName: addForm.name.value,
      userPassword: addForm.password.value,
    };
    const res = await postData(uUrl, data);
    if (res.success) {
      users.value = await fetchData(uUrl);
      setResponse(res, 'User added');
      addForm.name.value = '';
      addForm.password.value = '';
    } else {
      setResponse(res, 'Error adding user');
      addForm.name.value = '';
      addForm.password.value = '';
    }
  };

  const deleteUser = async (id) => {
    console.log('id', id);
    const res = await deleteData(uUrl, id);
    if (res.success) {
      users.value = await fetchData(uUrl);
      setResponse(res, 'User deleted');
    } else {
      setResponse(res, 'Error deleting user');
    }
  };
</script>

<template>
  <div class="container">
    <div>
      <h1>Users</h1>
      <ul>
        <li v-for="user in users" :key="user.id">
          <p>Uname: {{ user.userName }} - UID: {{ user.userId }}</p>
          <p>Role: {{ user.userRole }}</p>
        </li>
      </ul>
    </div>
    <div>
      <h1>Add User</h1>
      <form @submit.prevent="addUser" id="">
        <input
          type="text"
          v-model="addForm.name.value"
          placeholder="Username"
        />
        <input
          type="text"
          v-model="addForm.password.value"
          placeholder="User Password"
        />
        <input
          type="submit"
          :disabled="!addForm.name.value || !addForm.password.value"
          value="Add User"
        />
      </form>
    </div>
    <div>
      <h1>Delete User</h1>
      <select v-model="uId">
        <option v-for="user in users" :key="user.userId" :value="user.userId">
          {{ user.userName }}
        </option>
      </select>
      <input
        type="submit"
        @click="deleteUser({ id: uId })"
        :disabled="!uId"
        value="Delete User"
      />
    </div>
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
