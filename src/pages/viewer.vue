<template>
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="viewerNotStandBy" key="welcomePage"
                 class="d-flex f-col f-cross-center pd-t-950">
                <h3 class="ani--welcomeText h2 mg-b-050 z-3"> 
                    {{ welcomeMsg }} 
                </h3>
                <button class="btn--main"
                        v-if= "haventStart"
                        @click="startReading()">開始閱讀</button>
                
                <div class="aniItemBlock z-4">
                    <div v-for="itm in aniItem" 
                         class="aniItem__box aniItem--moveX" :style="itm.x">
                        <svg class="aniItem__box__itm aniItem--moveY" :style="itm.y">
                            <circle v-if="itm.ele==='circle'"  cx="12.5" cy="12.5" r="12.5" :fill="itm.fill"/>
                            <rect v-if="itm.ele==='rect'" height="25" width="25"  :fill="itm.fill"></rect>
                            <polygon v-if="itm.ele==='polygon'" points="12.5,0 0,25 25,25" :fill="itm.fill"></polygon>
                        </svg>
                    </div>
                </div>
            </div>
            <div v-else key="viewer">
                <nav class="d-flex f-main-end f-cross-center mg-b-050">
                    不喜歡嗎？
                    <button class="btn--main mg-l-050" 
                            @click="restartReading()">再挑一次</button>
                </nav>
                <!-- No effect :style="{'transition-duration' : (1)+'s'}"  -->
                <transition-group tag="div" name="slide">
                    <section v-for="(group,i) in view" :key="group.name + i"
                             class="articleGroup vmoveLayer" 
                             :style="{'z-index':i}">
                        <header class="articleGroup__head">
                            <svg class="articleGroup__head__icon" 
                                 height="1em" width="1em">
                                <circle v-if="groupStatusList[i] === 'accomplish' " 
                                        cx="0.5em" cy="0.5em" r="0.5em" fill="#00988e"/>
                                <rect v-else-if="groupStatusList[i] === 'overHalf' " 
                                      width="1em" height="1em"></rect>
                                <rect v-else-if="groupStatusList[i] === 'underHalf' " 
                                      width="1em" height="1em" fill="#ef4056"></rect>
                            </svg>
                            <span class="articleGroup__head__subTitle">
                                {{ group.accomplishNum + "/" + group.targetNum}}
                            </span>  
                            <h2 class="articleGroup__head__title">
                                {{ group.name }}
                            </h2>
                        </header>
                        <transition-group tag="ul" name="slide">
                            <li v-for="article in group.articles" :key="article.resolved_id" 
                                 class="articleBox vmoveLayer" 
                                 :style="{'z-index': i }">
                                <loading loader = "dots"
                                         :active.sync ="article.isLoading"
                                         :can-cancel="false" 
                                         :is-full-page="false"></loading>
                                <!-- FIX: top_image_url will failed -->
                                <card v-if="article.accomplishStatus === 'unaccomplish'"
                                      :key="'card' + article.item_id"
                                      :heading="article.given_title"
                                      :content="article.excerpt"
                                      :imgsrc="article.top_image_url"
                                      :linkurl="article.given_url"
                                      :tags="article.tags"
                                      :btns="cardBtns"
                                      @accomplish="accomplish(article,group)"></card>
                                <bar v-if="article.accomplishStatus === 'accomplish' "
                                     :key="'bar' + article.item_id"
                                     :title="article.given_title"
                                     :linkurl="article.given_url"
                                     :btns="barBtns"
                                     @unaccomplish="unaccomplish(article,group)"></bar> 
                            </li>
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
    .articleGroup{
        margin-bottom: 2.5em;
        &:last-child{
            margin-bottom: 0;
        }
        &__head{
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
            font-size: 2em;
            font-weight: bold;
            
            @include mobile{
                font-size: 1.75em;
            }
            &__icon{
                flex : 0 0 1em;
                margin-right: 0.25em;
            }
            &__subTitle{
                margin-right: 0.5em;
                font-style: italic;
            }
            &__title{
                word-break: break-all;
            }
        }
    }
    .articleBox{
        position: relative;
        margin-bottom: 2em;
        padding : 1em;
        background-color: $body-bg;

        &:last-child{
            margin-bottom: 0;
        }
    }

    .vmoveLayer{
        background-color: $body-bg;
    }

    .aniItemBlock{
        position: relative;
        display: flex;
        justify-content: center;
        margin-top: 100px;
        height : 25px;
        width: 100%;
        &::before{ // as curtain
            content: '';
            display: block;
            height:  100px;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: $body-bg;
            z-index : 9997;
        }
    }
    .aniItem__box, .aniItem__box__itm{
        height: 25px;
        width: 25px;
    }
    .aniItem__box{
        position: fixed;
    }

    .aniItem--moveX{
        transition-property: all;
        transition-timing-function : linear;
    }
    .aniItem--moveY{
        transition-property: all;
        transition-timing-function : cubic-bezier(.16,.6,.51,1.34);
    }

    .ani--welcomeText{
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-name: scale-up;
    }
    @keyframes scale-up{
        0%{
            transform: scale(0);
        }
        100%{
            transform: scale(1)
        }
    }
</style>

<script>
import produceViewer from '../mixins/produceViewer.js';
import card from '../components/card.vue';
import bar from '../components/bar.vue';
import Loading from 'vue-loading-overlay';

export default {
    name : "viewer",
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
            haventStart: true,
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
    computed:{
        viewerNotStandBy(){
            return this.view.length <= 0
        },
        groupStatusList(){
            return this.view.map(group => {
                return group.targetNum == group.accomplishNum      ? "accomplish" 
                      : (group.targetNum / 2) <= group.accomplishNum ? "overHalf" 
                      : "underHalf"
            })      
        },
        welcomeMsg(){
            return this.haventStart ? "開始今天的閱讀吧!" : "正在為你挑選...";
        },
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
                },2000)
            },500)
            
        },

        ballAnimation(){
            this.haventStart = false;
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
            this.$emit("accomplish",article,group)
        },
        unaccomplish(article,group){
            article.isLoading = true;
            this.$emit("unaccomplish",article,group)
        },
        

    },
    
}
</script>