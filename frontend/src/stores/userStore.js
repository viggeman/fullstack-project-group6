import { defineStore } from 'pinia';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userId: null,
    userName: null,
    favoriteMovies: [],
  }),
  actions: {
    login(userId, userName) {
      this.isLoggedIn = true;
      this.userId = userId;
      this.userName = userName;
      localStorage.setItem(
        'userData',
        JSON.stringify({
          isLoggedIn: this.isLoggedIn,
          userId: this.userId,
          userName: this.userName,
        })
      );
      window.location.href = '/user-page';
    },
    logout() {
      this.isLoggedIn = false;
      this.userId = null;
      this.userName = null;
      localStorage.removeItem('userData');
      window.location.href = '/user-login';
    },
  },
  getters: {
    getIsLoggedIn() {
      return {
        isLoggedIn: this.isLoggedIn,
      };
    },
    getUserId() {
      return this.userId;
    },
    getUserName() {
      return this.userName;
    },
  },
});
