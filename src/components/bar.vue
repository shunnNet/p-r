<template>
  <section class="bar">
      <div>OK</div>
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
    &__content{
        @extend %text-ellipsis;
        flex: 1;
    }
    &__list{
        display: flex;
    }

}
</style>