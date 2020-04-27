import './scss/base.scss';
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faThumbtack, faTimes, faPlus, faSave, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import './scss/util.scss';

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

library.add(faThumbtack,faTimes,faPlus,faSave,faPen)


Vue.component('font-awesome-icon',FontAwesomeIcon);

Vue.use(VueAxios,axios)

new Vue({
    router,
    render: h => h(App),

}).$mount("#app")