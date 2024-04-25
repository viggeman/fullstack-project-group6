import { createRouter, createWebHistory } from 'vue-router';
import FetchWriter from '../view/FetchWriter.vue';

const routes = [{ path: '/fetch-writer', component: FetchWriter }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
