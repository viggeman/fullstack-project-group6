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
  const uId = ref(null);
  const loginPassword = ref('');
  const loginName = ref('');
  const userStore = useUserStore();

  // Access the user state properties
  const response = ref({
    success: null,
    message: '',
  });

  const userData = JSON.parse(localStorage.getItem('userData'));

  const isLoggedIn = userData ? ref(userData.isLoggedIn) : ref(false);
  const userId = userData ? ref(userData.userId) : ref(null);
  const userName = userData ? ref(userData.userName) : ref('');
  console.log(isLoggedIn.value);

  userStore.$subscribe(() => {
    isLoggedIn.value = userStore.isLoggedIn;
    console.log(isLoggedIn.value);
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

  //call user store action
  const handleLogin = async (username, password) => {
    const url = uUrl + 'login';
    const res = await postData(url, {
      userName: username,
      userPassword: password,
    });

    if (res.success) {
      setResponse(res, res.name);
      loginName.value = '';
      loginPassword.value = '';
      userStore.login(res.id, res.name);
      userName.value = userStore.getUserName;
      console.log(userStore.getIsLoggedIn);
    } else {
      console.log('Error logging in');
    }
  };

  const handleLogout = () => {
    userStore.logout();
    setResponse({ success: true, message: 'Logged out' });
    isLoggedIn.value = false;
    // location.reload();
    console.log(userStore.getIsLoggedIn);
  };
</script>

<template>
  <div class="container">
    <h1>User Login</h1>

    <p
      v-if="response.success !== null"
      :class="response.success ? 'success' : 'error'"
    >
      {{ response.message }}
    </p>
    <p v-if="isLoggedIn">Logged in as: {{ userName }}</p>
    <form
      v-if="!isLoggedIn"
      @submit.prevent="handleLogin(loginName, loginPassword)"
    >
      <input type="text" v-model="loginName" />
      <input type="text" v-model="loginPassword" />
      <input
        type="submit"
        :disabled="!loginName || !loginPassword"
        value="Login"
      />
    </form>
    <form v-else @submit.prevent="handleLogout">
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
