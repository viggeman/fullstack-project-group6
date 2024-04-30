import { createRouter, createWebHistory } from 'vue-router';
import FetchWriter from '../view/FetchWriter.vue';
import FetchActor from '../view/FetchActor.vue';
import FetchMovieActors from '../view/FetchMovieActors.vue';
import FetchGenre from '../view/FetchGenres.vue' 
import Home from '../view/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/fetch-writer', component: FetchWriter },
  { path: '/fetch-actor', component: FetchActor },
  { path: '/fetch-movie-actor', component: FetchMovieActors },
  { path: '/fetch-genre', component: FetchGenre}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
