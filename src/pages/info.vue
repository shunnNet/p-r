<template>
    <article class="f-size-rem120">
       <h2 class="h2 mg-b-050"> How to use ? </h2> 
       <p class="mg-b-100"> 
           請先到 <router-link class="color-sub color--hover-main" to="/config">「調整」</router-link> 設定每天要看的文章。<br>
       </p>
       <h3 class="h3 mg-b-050">任務</h3>
       <p class="mg-b-100">
           任務可以<span class="color-main">挑出具有指定標籤</span>的 Pocket 文章。
           任務底下的每一行選項代表一組條件，當你在一行中選取標籤如
           <span class="color-main">「美食」</span>、<span class="color-main">「旅遊」</span>，
           該任務便會為您隨機挑出<span class="color-main">同時具有這兩個標籤</span>的文章。<br>
           
       </p>
       <h3 class="h3 mg-b-050">閱讀</h3>
       <p>
           當你設定好任務之後，就可以在 「調整 > 閱讀」 的區塊選擇該任務，並設定每天要看的篇數。
       </p>
       
    </article>
</template>

<style lang="scss">
@import "../scss/env";

    
</style>

<script>
export default {
    name: "info",
    inheritAttrs: false,
    data(){
        return {
            msg : "I am Graph!"
        }
    },
    created(){
        // console.log(this.$route);
    }
}
</script>