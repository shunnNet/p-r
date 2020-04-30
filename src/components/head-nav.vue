<template>
  <nav class="navi">
    <font-awesome-icon class="navi__iconBtn mg-r-050 d-none d-block-pad" icon="bars" @click="$emit('toggle_menu')"></font-awesome-icon>
    <h1 class="navi__logoBox">
        random
    </h1>
    
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
    display: flex;
    align-items: center;
    background-color: $body-bg;
    padding: 10px 20px;
    
  &__logoBox {
      display: block;
      text-indent: 101%;
      overflow: hidden;
      background-image: url(../image/fake_logo.svg);
      background-size: contain;
      background-repeat: no-repeat;
      height : 40px;
      flex: 1;
  }
  &__iconBtn{
      color: $sub;
      user-select: none;
      height : 40px;
      font-size: 1.75em;
      cursor: pointer;
      @extend %no-pointer-touch-device;
  }
}
</style>
