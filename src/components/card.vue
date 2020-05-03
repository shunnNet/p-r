<template>
  <article class="card card--base">
      <h3>
        <a class="card__head" :href="linkurl" target="_blank">
            {{ title }}
        </a>
      </h3>
      <section class="card__content">
        <p class="card__content__p">
            {{ content }}
        </p>
        <figure v-if="imgsrc" class="card__content__figure">
            <img :src="imgsrc" alt="img"/>
        </figure>
      </section>
      <footer class="card__footer">
          <button v-for="btn in btns" @click="$emit(btn.eventName)" 
                  class="btn--base">{{ btn.text }}</button>
      </footer>
  </article>
</template>

<script>
export default {
  name: "card",
  props: ["heading", "content", "imgsrc","linkurl","btns"],
  computed: {
      title (){
          return this.heading ? this.heading : '未知的標題'
      }
  }
};
</script>

<style lang="scss">
@import "../scss/env";
.card {
  &__head {
    display: block;
    font-size: 1.5em;
    padding-bottom: 0.34em;
    margin-bottom: 0.5em;
    word-break: break-all;
  }
  &__content {
    display: flex;
    flex-wrap: wrap-reverse;
    margin-bottom: 0.75em;
    &__p {
      flex: 1 0 1px;
    }
    &__figure {
        display: flex;
        justify-content: center;
        flex: 0 0 200px;
        padding: 0.75em;
      @include pad{
          flex: 1 0 100%;
      }
    }
  }
}
.card--base {
  .card__head {
    border-bottom: 1px solid #000;
    &:hover{
        color: $main;
    }
  }
}
</style>