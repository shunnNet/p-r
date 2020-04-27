<template>
  <nav class="navi">
    <a href class="navi__logoBox">
      <img src="../image/logo_sample.svg" alt="random" 
            class="navi__logoBox__logo" />
    </a>
  </nav>
</template>

<script>
export default {
  name: "head-nav"
};
</script>

<style lang="scss">
@import "../scss/env";
.navi {
    padding: 20px;
  &__logoBox {
    &__logo {
      display: block;
      height: 30px;
    }
  }
}
</style>
