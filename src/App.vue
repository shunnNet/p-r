<template>
    <div id="app" class="box-full">
        <loading 
            :active.sync ="loading"
            :can-cancel="false" 
            :is-full-page="true"></loading>
        <div class="box-full box-navi">
            <head-nav @toggle_menu="toggleSideBar()"></head-nav>
        </div>
        <side-menu class="sideMenu-mobile" id="js-side-bar"></side-menu>
        <main class="main box-lg" @click="closeSideBar()">
            <side-menu class="sideMenu"></side-menu>

            <transition name="fade" mode="out-in">
                    <keep-alive :exclude="['config','info']">
                        <router-view class="appView" v-if="dataStandby"
                                    :articles="all_articles"
                                    :settings="settings"
                                    :records="records"
                                    :tags = "tags"
                                    @accomplish="accomplish"
                                    @unaccomplish="unaccomplish"
                                    @configure="configure"
                                    ></router-view>
                    </keep-alive>
        

            </transition>
            
        </main>
    </div>
</template>

<script>

import head_nav from "./components/head-nav.vue";
import main_menu from "./components/side-menu.vue";
import ajax from './mixins/ajax';
import Loading from 'vue-loading-overlay';

export default {
    name : "app",
    data(){
        return {
            msg : "I am app.",
            all_articles :[],
            settings : {},
            records : [],
            loading : true,
            dataStandby: false,
            tags : null
        }
    },
    mixins:[ajax],
    components : {
        "side-menu" : main_menu,
        "head-nav" : head_nav,
        Loading,
    },
    created() {
        console.log(this.$route,"app");
        
        this.ajaxRetrievePreset()
            .then(response => this.presetData(response))
            .catch(err => console.log(err) )
    },
    watch:{
        '$route' : function(){
            this.closeSideBar()
        }
    },

    methods: {
        toggleSideBar(){
            document.getElementById('js-side-bar').classList.toggle('showMenu');
        },
        closeSideBar(){
            document.getElementById('js-side-bar').classList.remove('showMenu');
        },

        presetData(preset){
            this.$set(this,'all_articles',preset.all_articles);
            this.$set(this,'settings',{ viewer : preset.document.viewer , 
                                       mission : preset.document.mission});
            this.$set(this,'records',preset.document.records);
            const tagSet = this.getTagsSetInArticles(preset.all_articles);
            this.$set(this,'tags',[...tagSet]);

         
            console.log("preset OK, App standBy.");

            this.loading = false;
            this.dataStandby = true;
            return true;
        },
        getTagsSetInArticles(articles){
            let tags = [];
            articles.forEach(article =>{ 
                
                tags = tags.concat(article.tags)
            })
            return new Set(tags);
        },

        accomplish(article,group){
           console.log("accomplish",article,"2020/4/20",article.item_id)
           this.ajaxAccomplishArticle(article,"2020/4/20",group.mid)
               .then(newRecord=>{
                   
                   this.$set(this,'records',newRecord)
                   console.log("addRecord",this.records)
                //    this.$set(article,"accomplishStatus","accomplish")
                   article.isLoading = false;
                   article.accomplishStatus = "accomplish";
                   group.accomplishNum += 1
               })
        },
        unaccomplish(article,group){
           console.log("unaccomplish",article.given_title,"2020/4/20",article.item_id)
           this.ajaxUnaccomplishArticle(article.item_id)
               .then(deprecatedRecord=>{
                   const targetIndex = this.records.findIndex(record => record.article.item_id === deprecatedRecord.article.item_id)
                   this.records.splice(targetIndex,1);
                    console.log("removeRecord",this.records)
                //    this.$set(article,"accomplishStatus","unaccomplish")
                   article.isLoading = false;
                   article.accomplishStatus = "unaccomplish";
                   group.accomplishNum -= 1
               })
        },
        configure(configs){
           console.log("configure",configs);
           this.loading = true;
           this.ajaxUpdateSettings(configs)
               .then(response=>{
                   console.log("configure complete",response);
                   this.$set(this,'settings',configs);
                   
                   this.loading = false;
                   this.$router.push({path: "view"})
               })
        },
    },

}
</script>

<style lang="scss">
@import "./scss/env";

    .box-navi{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9998;
        .navi{
            max-width: $container-width-lg;
            margin: auto;
        }
    }
    .main{
        display: flex;
        padding: 30px 10px;
    }
    .sideMenu{
        flex : 0 0 150px;
        width: 150px;
        margin-right: 2em;
        background-color: $body-bg;
    }

    .appView{
        flex: 1 0 0;
        @include pad{
            flex : 1 0 100%;
        }
    }
    .sideMenu-mobile{
        display: none;
        width: 150px;
        z-index: 9998;
        background-color: $body-bg;
        transform: translate3d(-100%,0,0);
    }
    @include pad{
        #appView{
            flex : 1 0 100%;
        }
        .sideMenu{
            display: none;
        }
        .showMenu{
            transform : none;
        }
        .sideMenu-mobile{
            display: block;
            position: fixed;
            padding-top: 30px;
            top: 60px;
            left: 0;
            bottom: 0;
            transition : .2s;
        }
    }
</style>
