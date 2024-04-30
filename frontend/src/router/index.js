import { createRouter, createWebHistory } from 'vue-router';
import FetchWriter from '../view/FetchWriter.vue';
import FetchGenres from '../view/FetchGenres.vue';

const routes = [
{ 
 path: '/fetch-writer',
 component: FetchWriter 
},
{
  path: '/fetch-genres',
  component: FetchGenres
}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
