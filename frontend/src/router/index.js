import { createRouter, createWebHistory } from 'vue-router';
import FetchWriter from '../view/FetchWriter.vue';
import FetchActor from '../view/FetchActor.vue';

const routes = [
    { path: '/fetch-writer', component: FetchWriter },
    { path: '/fetch-actor', component: FetchActor },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
