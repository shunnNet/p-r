<template>
  <section class="bar bar--base">
      <svg width="1em" height="1em" class="mg-r-050">
        <circle cx="0.5em" cy="0.5em" r="0.5em" fill="#00988e"/>
      </svg>
      <a class="bar__content" 
        :href="linkurl" 
        target="_blank"> {{heading}} </a>
      <ul class="bar__list">
          <li>
          <button v-for="btn in btns" @click="$emit(btn.eventName)" 
                  class="btn--base">{{ btn.text }}</button>
          </li>
      </ul>
  </section>
</template>

<script>
export default {
  name: "bar",
  props: ["linkurl","heading","btns"],
    // btns : [ {eventName:"", text: "" } ]
};
</script>

<style lang="scss">
@import "../scss/env";
.bar{
    display: flex;
    align-items: center;
    &__content{
        @extend %text-ellipsis;
        flex: 1;
        width: 0; // for Chrome fix
    }
    &__list{
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