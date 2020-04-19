import Vue from "vue";
import VueRouter from 'vue-router';
import viewer from '../pages/viewer.vue';
import graph from '../pages/graph.vue';
import config from '../pages/config.vue';


Vue.use(VueRouter);

const routes = [
    {
        path : '/',
        redirect : {name : "Viewer"}
    },
    {
        name : "Viewer",
        path : '/view',
        component : viewer
    },
    {
        name : "Graph",
        path : '/graph',
        component : graph
    },
    {
        name : "Config",
        path : '/config',
        component : config
    },
]

export default new VueRouter({
    routes
})