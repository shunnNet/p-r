<template>
    <div>
        <button @click="produceViewer()">produce</button>
        
            <div class="box-cardGroup" v-for="(group,i) in view" :key="Math.random()">
                <h2 class="h2"> {{ group.name + " " + group.accomplishNum + "/" + group.targetNum }}    </h2>
                <transition-group name="list" tag="div">
                    <div class="box-card" v-for="article in group.articles" :key="article.item_id">
                        <!-- <a :href="article.given_url" target="_blank"> 
                            {{ article.given_title }} 
                        </a> -->
                        <loading 
                        :active.sync ="article.isLoading"
                        :can-cancel="true" 
                        :is-full-page="false"></loading>
                        
                        <card v-if="article.accomplishStatus === 'unaccomplish'"
                            :heading="article.given_title"
                            :content="article.excerpt"
                            :imgsrc="article.top_image_url"
                            :linkurl="article.given_url"
                            :btns="cardBtns"
                            @accomplish="accomplish(article,group)"></card>
                        <bar v-if="article.accomplishStatus === 'accomplish' "
                            :heading="article.given_title"
                            :linkurl="article.given_url"
                            :btns="barBtns"
                            @unaccomplish="unaccomplish(article,group)"></bar>

                    </div>
            </transition-group>
                
            </div>
         
    </div>
</template>

<style lang="scss">
    @import '~vue-loading-overlay/dist/vue-loading.css';
    .box-cardGroup{
        margin-bottom: 40px;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .box-card{
        position: relative;
        margin-bottom: 30px;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }
    .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
    .list-move {
        transition: transform .5s;
    }
</style>

<script>
import produceViewer from '../mixins/produceViewer.js';
import card from '../components/card.vue';
import bar from '../components/bar.vue';
import Loading from 'vue-loading-overlay';

export default {
    data(){
        return {
            loading: false,
            cardBtns : [
                {eventName : "accomplish" , text: "accomplish"}
            ],
            barBtns:[
                {eventName : "unaccomplish" , text: "recover"}
            ]
        }
    },
    mixins:[produceViewer],
    components : {
        card,
        bar,
        Loading,
    },
    methods:{
        accomplish(article,group){
            article.isLoading = true;
            //this.$set(article,"accomplishStatus","pending");
            
            console.log(article.accomplishStatus);
            
            this.$emit("accomplish",article,group)
        },
        unaccomplish(article,group){
            article.isLoading = true;
            // article.accomplishStatus ="pending"
            // this.$set(article,"accomplishStatus","pending");
            this.$emit("unaccomplish",article,group)
        },
        

    },
    
}
</script>