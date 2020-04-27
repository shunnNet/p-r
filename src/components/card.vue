<template>
  <article class="card card--base">
    <div class="card__main">
      <a class="card__head" :href="linkurl" target="_blank">{{ heading }}</a>
      <section class="card__content">
        <p class="card__content__p">{{ content }}</p>
        <figure v-if="imgsrc" class="card__content__figure">
          <img :src="imgsrc" alt="img"/>
        </figure>
      </section>
      <footer class="card__footer">
          <button v-for="btn in btns" @click="$emit(btn.eventName)" 
                  class="btn--base">{{ btn.text }}</button>
      </footer>
    </div>
  </article>
</template>

<script>
export default {
  name: "card",
  props: ["heading", "content", "imgsrc","linkurl","btns"],
    // btns : [ {eventName:"", text: "" } ]
};
</script>

<style lang="scss">
@import "../scss/env";
.card {
  display: flex;
  &__head {
    display: block;
    font-size: 1.5em;
    padding-bottom: 5px;
    margin-bottom: 10px;
    word-break: break-all;
  }
  &__content {
    display: flex;
    flex-wrap:wrap-reverse;
    margin-bottom: 10px;
    &__p {
      flex: 1 0 2px;
    }
    &__figure {
      flex: 0 0 200px;
      padding: 10px;
      @include pad{
          flex: 1 0 100%;
      }
    }
  }

  &__main {
      flex: 1;
  }
}
.card--base {
  .card__head {
    border-bottom: 1px solid #000;
    &:hover{
        color: red;
    }
  }
}
</style>