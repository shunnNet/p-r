import Vue from 'vue';
import App from './App.vue';

//window.alert("hello IE")

console.log("look where am I ? ")
/*
try {
    var a = Array.from('foo');
    window.alert(a);
}catch(e){
    window.alert(e)
}*/


new Vue({
    render: h => h(App),

}).$mount("#app")