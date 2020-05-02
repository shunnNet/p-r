<template>
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="view.length <= 0" key="welcomePage"
                 class="d-flex f-col f-all-center" style="padding-top: 150px;">
                <h2 class="h2 mg-b-050 ani--scale-up" style="z-index : 9997"> {{ welcomeMsg }} </h2>
               
                <button :class="{'opcaity-0' :haveStart, 'v-invisible' :haveStart}" class="btn--main" @click="startReading()">開始閱讀</button>
                
                <div class="aniItemBlock" >
                    <div class="aniItem__box aniItem--moveX" v-for="itm in aniItem" :style="itm.x">
                        <svg class="aniItem__itm aniItem--moveY" :style="itm.y">
                            <circle  v-if="itm.ele==='circle'"  cx="12.5" cy="12.5" r="12.5" :fill="itm.fill"/>
                            <rect  v-if="itm.ele==='rect'" height="25" width="25"  :fill="itm.fill"></rect>
                            <polygon  v-if="itm.ele==='polygon'" points="12.5,0 0,25 25,25" :fill="itm.fill"></polygon>
                        </svg>
                    </div>
                </div>
            </div>
            <div v-else key="articleReader" >
                <nav class="d-flex f-main-end f-cross-center mg-b-050">
                    不喜歡嗎？<button class="mg-l-050 btn--main" @click="restartReading()">再挑一次</button>
                </nav>
                <!-- No effect :style="{'transition-duration' : (1)+'s'}"  -->
                <transition-group tag="div" name="slide" appear>
                    <section class="box-cardGroup" v-for="(group,i) in view" :key="group.name+i" :style="{'z-index':i}">
                        <header class="box-cardGroup__head" style="position:relative; z-index : 5" >
                            <svg height="1em" width="1em" class="box-cardGroup__head__icon svg-icon mg-r-025" fill="#fcb643">
                                <circle v-if="group.targetNum == group.accomplishNum" cx="0.5em" cy="0.5em" r="0.5em" fill="#00988e"/>
                                <rect v-else-if="(group.targetNum / 2) <= group.accomplishNum " width="1em" height="1em" class="rect"></rect>
                                <rect v-else-if="(group.targetNum / 2) > group.accomplishNum " width="1em" height="1em" class="rect" fill="#ef4056"></rect>
                            </svg>
                            <span style="font-style: italic;" class="mg-r-050">{{ group.accomplishNum + "/" + group.targetNum}}</span>  
                            <h2 class="box-cardGroup__head__title">{{ group.name }}</h2>
                        </header>
                        <transition-group tag="div" name="slide" style="position:relative; z-index : 4">
                            <div class="box-card" v-for="article in group.articles" :key="article.resolved_id" :style="{'z-index':i}">
                                <loading loader = "dots"
                                         :active.sync ="article.isLoading"
                                         :can-cancel="true" 
                                         :is-full-page="false"></loading>
                                <!-- FIX: top_image_url will failed -->
                                <card v-if="article.accomplishStatus === 'unaccomplish'"
                                      :key="'card' + article.item_id"
                                      :heading="article.given_title"
                                      :content="article.excerpt"
                                      :imgsrc="article.top_image_url"
                                      :linkurl="article.given_url"
                                      :btns="cardBtns"
                                      @accomplish="accomplish(article,group)"></card>
                                <bar v-if="article.accomplishStatus === 'accomplish' "
                                     :key="'bar' + article.item_id"
                                     :heading="article.given_title"
                                     :linkurl="article.given_url"
                                     :btns="barBtns"
                                     @unaccomplish="unaccomplish(article,group)"></bar> 
                            </div>
                       </transition-group>
                        
                    </section>
                </transition-group>
                 
            </div>
        </transition>
    </div>
</template>

<style lang="scss">
@import '~vue-loading-overlay/dist/vue-loading.css';
@import "../scss/env";
    .aniItemBlock{
        position: relative;
        display: flex;
        justify-content: center;
        margin-top: 100px;
        height : 25px;
        width: 100%;
        &::before{
            content: '';
            display: block;
            height:  100px;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: $body-bg;
            z-index: 9997;
        }

    }
    .aniItem__box{
        height: 25px;
        width: 25px;
        position: fixed;
        z-index: 9996;
    }
    .aniItem__itm{
        height: 25px;
        width: 25px;
    }
    .aniItem--moveX{
        transition-property: all;
        transition-timing-function : linear;
    }
    .aniItem--moveY{
        transition-property: all;
        transition-timing-function : cubic-bezier(.16,.6,.51,1.34);
    }

    .box-cardGroup{
        background-color: $body-bg;
        margin-bottom: 40px;
        &:last-child{
            margin-bottom: 0;
        }
        &__head{
            font-size: 2em;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
            background-color: $body-bg;
            
            @include mobile{
                font-size: 1.75em;
            }
            &__icon{
                flex : 0 0 1em;
            }
            &__title{
                word-break: break-all;
            }
        }
    }
    .box-card{
        position: relative;
        margin-bottom: 30px;
        padding : 10px 0 10px 20px;
        background-color: $body-bg;

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
    inheritAttrs : false,
    data(){
        return {

            loading: false,
            cardBtns : [
                {eventName : "accomplish" , text: "標示為已閱讀"}
            ],
            barBtns:[
                {eventName : "unaccomplish" , text: "復原"}
            ],
            welcomeMsg: "開始今天的閱讀吧!",
            haveStart: false,
            aniItem: [
                { ele: "circle", fill: "#00988e" , x: "" , y:"" },
                { ele: "rect", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "polygon", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "polygon", fill: "#fcb643" , x: "" , y:"" },
                { ele: "rect", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "circle", fill: "#00988e" , x: "" , y:"" },
                { ele: "circle", fill: "#00988e" , x: "" , y:"" },
                { ele: "rect", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "polygon", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "polygon", fill: "#fcb643" , x: "" , y:"" },
                { ele: "rect", fill: "#fcb643" , x: "" , y:"" },
                { ele: "circle", fill: "#ef4056" , x: "" , y:"" },
                { ele: "rect", fill: "#00988e" , x: "" , y:"" },
                { ele: "circle", fill: "#00988e" , x: "" , y:"" },
            ],
        }
    },
    mixins:[produceViewer],
    components : {
        card,
        bar,
        Loading,
    },
    methods:{
        startReading(){
            this.ballAnimation()
            setTimeout(()=>{
                this.produceViewer();
                this.resetBallAnimation()
                this.welcomeMsg = "正在為你挑選...";
            },2000)
        },
        restartReading(){
            this.view = [];
            //
            setTimeout(() => {  
                this.ballAnimation()
                setTimeout(()=>{
                    this.produceViewer();
                    this.resetBallAnimation()
                    this.welcomeMsg = "正在為你挑選...";
                },2000)
            },500)
            
        },

        ballAnimation(){
            this.haveStart = true;
            const maxY = 500;
            const maxX = 500;

            this.aniItem.forEach(item => {
                var randomTime = Math.random() * 2 + 2;
                var randomX = Math.random();
                var randomY = Math.random();
                var direction = Math.random() > 0.5 ? 1 : -1;
                item.x = `transform: translate3d(${maxX * randomX * direction }px,0,0); transition-duration: ${randomTime}s`
                item.y = `transform: translate3d(0,${maxY * randomY * -1 + -25}px,0); transition-duration: ${randomTime}s`
            })
        },
        resetBallAnimation(){
            this.aniItem.forEach(item => {
                item.x = "";
                item.y = "";
            })
        },
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
        

    }
    
}
</script>