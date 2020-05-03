<template>
    <div id="app" class="box-full">
        <loading :active.sync ="loading"
                 :can-cancel="false" 
                 :is-full-page="true"></loading>

        <div class="box-stickyHead">
            <div class="box-full">
                <div class="box-navi">
                    <head-nav @toggle_menu="showMenu = !showMenu"></head-nav>
                </div>
            </div>
        </div>

        <side-menu class="sideMenu-mobile" 
                   :class="{'showMenu' : showMenu}">
        </side-menu>

        <main class="box-main box-lg" 
              @click="showMenu = false">

            <side-menu class="sideMenu"></side-menu>

            <transition name="fade" mode="out-in">
                    <keep-alive :exclude="['config']">
                        <router-view class="appView" 
                                     v-if="dataStandby"
                                     :articles="all_articles"
                                     :settings="settings"
                                     :records="records"
                                     :tags = "tags"
                                     @accomplish="accomplish"
                                     @unaccomplish="unaccomplish"
                                     @configure="configure"></router-view>
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
            tags : [],
            loading : true,
            dataStandby: false,
            showMenu : false,
        }
    },
    mixins:[ajax],
    components : {
        "side-menu" : main_menu,
        "head-nav" : head_nav,
        Loading,
    },
    created() {
        this.ajaxRetrievePreset()
            .then(response => this.presetData(response))
            .catch(err => console.log(err) )
    },
    watch:{
        '$route' : function(){
            this.showMenu = false;
        }
    },

    methods: {
        presetData(preset){
            this.$set(this,'all_articles',preset.all_articles);
            this.$set(this,'settings',{ viewer : preset.document.viewer , 
                                       mission : preset.document.mission});
            this.$set(this,'records',preset.document.records);
            const tagSet = this.getTagsSetInArticles(preset.all_articles);
            this.$set(this,'tags',[...tagSet]);

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
        //    console.log("accomplish",article,"2020/4/20",article.item_id)
           this.ajaxAccomplishArticle(article,"2020/4/20",group.mid)
               .then(newRecord=>{
                   
                   this.$set(this,'records',newRecord)
                //    console.log("addRecord",this.records)
                   article.isLoading = false;
                   article.accomplishStatus = "accomplish";
                   group.accomplishNum += 1
               })
        },
        unaccomplish(article,group){
           this.ajaxUnaccomplishArticle(article.item_id)
               .then(deprecatedRecord=>{
                   const targetIndex = this.records.findIndex(record => record.article.item_id === deprecatedRecord.article.item_id)
                   this.records.splice(targetIndex,1);
                   article.isLoading = false;
                   article.accomplishStatus = "unaccomplish";
                   group.accomplishNum -= 1
               })
        },
        configure(configs){
           this.loading = true;
           this.ajaxUpdateSettings(configs)
               .then(response=>{
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
    .box-stickyHead{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9998;
        width: 100%;
    }
    .box-navi{
        max-width: $container-width-lg;
        margin: auto;
    }
    .box-main{
        display: flex;
        padding: 30px 10px;
    }
    .appView{
        flex: 1 0 0;
    }
    .sideMenu, .sideMenu-mobile{
        width: 150px;
        background-color: $body-bg;
    }

    .sideMenu{
        flex : 0 0 150px;
        margin-right: 2em;
    }

    .sideMenu-mobile{
        display: none;
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 0;
        padding-top: 30px;
        z-index: 9998;
        transform: translate3d(-100%,0,0);
        transition : .2s;
    }
    @include pad{
        .appView{
            flex : 1 0 100%;
        }
        .sideMenu{
            display: none;
        }
        .sideMenu-mobile{
            display: block;
        }
        .showMenu{
            transform : none;
        }
    }
</style>
