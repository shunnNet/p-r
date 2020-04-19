<template>
    <div>
        <h1>{{ msg }}</h1>
        <div class="bg"></div>
        <side-menu></side-menu>
        <router-view :articles="all_articles"
                     :settings="settings"></router-view>
    </div>
</template>

<script>
import main_menu from "./components/main-menu.vue";
import ajax from './mixins/ajax'

export default {
    name : "app",
    data(){
        return {
            msg : "I am app.",
            all_articles :[],
            settings : {},
            records : []
        }
    },
    mixins:[ajax],
    components : {
        "main-menu" : main_menu
    },
    created() {
        this.ajaxRetrievePreset()
            .then(response => this.presetData(response))
            .catch(err => console.log(err) )
    },
    methods: {
        presetData(preset){
            this.$set(this,'all_articles',preset.all_articles);
            this.$set(this,'settings',{ viewer : preset.document.viewer , 
                                       mission : preset.document.mission});
            this.$set(this,'records',preset.document.records);
            console.log(this.$data)
            return true;
        }
    },

}
</script>

<style lang="scss">
    $primary : green;
    h1 {
        color : $color;
        display : flex;
        transform: translateY(50%);
    }
    .bg {
        height : 100px;
        width : 40px;
        background-image: url('./image/4PDJurf.jpg');;
    }
</style>
