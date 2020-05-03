<template>
  <section class="bar bar--base">
      <svg class="mg-r-050"
           width="1em" height="1em">
        <circle cx="0.5em" cy="0.5em" r="0.5em" fill="#00988e"/>
      </svg>
      <a class="bar__title" 
         :href="linkurl" 
         target="_blank"> {{ heading }} </a>
      <ul class="bar__btnList">
          <li>
                <button v-for="btn in btns" 
                        @click="$emit(btn.eventName)" 
                        class="btn--base">{{ btn.text }}</button>
          </li>
      </ul>
  </section>
</template>

<script>
export default {
  name: "bar",
  props: ["linkurl","title","btns"],
  computed: {
      heading (){
          return this.title ? this.title : '未知的標題'
      }
  }
    // btns : [ {eventName:"", text: "" } ]
};
</script>

<style lang="scss">
@import "../scss/env";
.bar{
    display: flex;
    align-items: center;
    &__title{
        @extend %text-ellipsis;
        flex: 1;
        width: 0; // ellipsis , for Chrome fix
    }
    &__btnList{
        display: flex;
    }
}
.bar--base {
  .bar__content {
    &:hover{
        color: $main;
    }
  }
}
</style>