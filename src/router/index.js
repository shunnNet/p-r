import Vue from "vue";
import VueRouter from 'vue-router';
import viewer from '../pages/viewer.vue';
import info from '../pages/info.vue';
import config from '../pages/config.vue';


Vue.use(VueRouter);

const routes = [
    {
        path : '*',
        redirect : {name : "Viewer"}
    },
    {
        name : "Viewer",
        path : '/view',
        component : viewer
    },
    {
        name : "Info",
        path : '/info',
        component : info
        
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