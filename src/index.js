import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';

Vue.use(VueAxios,axios)

new Vue({
    router,
    render: h => h(App),

}).$mount("#app")