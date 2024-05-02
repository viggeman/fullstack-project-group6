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
      localStorage.setItem(
        'userData',
        JSON.stringify({
          isLoggedIn: this.isLoggedIn,
          userId: this.userId,
          userName: this.userName,
        })
      );
    },
    logout() {
      this.isLoggedIn = false;
      this.userId = null;
      this.userName = null;
      localStorage.removeItem('userData');
    },
  },
  getters: {
    created() {
      this.$onAction('login', () => {
        console.log('User logged in!');
        // Perform actions upon login (optional)
      });
      this.$onAction('logout', () => {
        console.log('User logged out!');
        // Perform actions upon logout (optional)
      });
    },
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
