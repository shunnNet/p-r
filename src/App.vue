<template>
    <div id="app" class="box-full">
        <loading 
            :active.sync ="loading"
            :can-cancel="true" 
            :is-full-page="true"></loading>
        <div class="box-full box-navi">
            <head-nav></head-nav>
        </div>
        
        <main class="main box-lg">
            <side-menu id="sideMenu"></side-menu>
            <router-view id="appView"
                        :articles="all_articles"
                        :settings="settings"
                        :records="records"
                        :tags = "tags"
                        @accomplish="accomplish"
                        @unaccomplish="unaccomplish"
                        @configure="configure"></router-view>
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
            const tagSet = this.getTagsSetInArticles(preset.all_articles);
            this.$set(this,'tags',[...tagSet]);

         
            console.log("preset OK, App standBy.");

            this.loading = false;
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
                   this.$set(this,'settings',configs)
                   this.loading = false;
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
        .navi{
            max-width: $container-width-lg;
            margin: auto;
        }
    }
    .main{
        position: relative;
        top : 70px;
        display: flex;
        padding: 30px 10px;
    }
    #sideMenu{
        flex : 0 0 150px;
    }
    #appView{
        flex: 1 0 0;
        @include pad{
            flex : 1 0 100%;
        }
    }
    @include pad{
        #appView{
            flex : 1 0 100%;
        }
        #sideMenu{
            display: none;
        }
    }
</style>
