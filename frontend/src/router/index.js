import { createRouter, createWebHistory } from 'vue-router';
import Home from '../view/Home.vue';
import FetchWriter from '../view/FetchWriter.vue';
import FetchActor from '../view/FetchActor.vue';
import FetchMovieActors from '../view/FetchMovieActors.vue';
import FetchGenres from '../view/FetchGenres.vue';
import Users from '../view/Users.vue';
import UserLogin from '../view/UserLogin.vue';
import FetchMovie from '../view/FetchMovie.vue';
import FetchDirector from '../view/FetchDirector.vue';
import FetchComposer from '../view/FetchComposer.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/fetch-writer', component: FetchWriter },
    { path: '/fetch-actor', component: FetchActor },
    { path: '/fetch-movie-actor', component: FetchMovieActors },
    { path: '/fetch-genre', component: FetchGenres },
    { path: '/users', component: Users },
    { path: '/user-login', component: UserLogin },
    { path: '/fetch-movie', component: FetchMovie },
    { path: '/fetch-director', component: FetchDirector },
    { path: '/fetch-composer', component: FetchComposer}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
