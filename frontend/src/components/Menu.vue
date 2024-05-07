<script setup>
  import { useUserStore } from '../stores/userStore';
  import { ref, onMounted, watch, computed } from 'vue';

  const userStore = useUserStore();
  const userData = JSON.parse(localStorage.getItem('userData'));

const isLoggedIn =
    userData && userData.isLoggedIn !== undefined
        ? ref(userData.isLoggedIn)
        : ref(false);
console.log(isLoggedIn.value);

  userStore.$subscribe(() => {
    isLoggedIn.value = userStore.isLoggedIn;
    console.log(isLoggedIn.value);
  });

  const handleLogout = () => {
    userStore.logout();
    isLoggedIn.value = false;
    console.log('logga ut');
  };
</script>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .main-nav {
    display: flex;
    align-items: center;
    height: 7rem;
    margin-left: 2rem;
  }

  .login-btn {
    color: black;

    padding: 1rem 1rem;
    margin: 1rem -1rem;
    cursor: pointer;
  }

  .login-nav {
    display: flex;
    align-items: center;
    height: 7rem;
    margin-right: 2rem;
    color: black;
  }

  .menu-col1 {
    display: flex;
    list-style: none;
    margin-left: 4rem;
  }

  .menu-col1 li {
    margin-right: 4rem;
  }

  .menu-col1 li:last-child {
    margin-right: 0;
  }
</style>

<template>
    <header class="header">
        <nav class="main-nav">
            <router-link to="/"><h2>GRUPP6</h2></router-link>
            <ul class="menu-col1">
                <li>
                    <router-link to="/fetch-movie-actor"
                        >MovieActors</router-link
                    >
                </li>
                <li><router-link to="/fetch-writer">Writers</router-link></li>
                <li><router-link to="/fetch-actor">Actors</router-link></li>
                <li><router-link to="/fetch-genre">Genres</router-link></li>
                <li><router-link to="/users">Users</router-link></li>
                <li><router-link to="/fetch-movie">Movies</router-link></li>
            </ul>
        </nav>
        <nav class="login-nav">
            <router-link v-if="!isLoggedIn" to="/user-login"
                >Log In</router-link
            >
            <button v-else @click="handleLogout">Logout</button>
        </nav>
    </header>
</template>
