import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userId: null,
    userName: null,
  }),
  actions: {
    login(userId, userName) {
      this.isLoggedIn = true;
      this.userId = userId;
      this.userName = userName;
    },
    logout() {
      this.isLoggedIn = false;
      this.userId = null;
      this.userName = null;
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
