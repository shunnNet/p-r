<template>
    <div>
        <h1>{{ msg }}</h1>
        <div class="bg"></div>
    </div>
</template>

<style lang="scss">
    $primary : green;
    h1 {
        color : $color;
        display : flex;
        transform: translateY(50%);
    }
    .bg {
        height : 100px;
        width : 40px;
        background-image: url('./image/4PDJurf.jpg');;
    }
</style>

<script>
export default {
    name : "app",
    data(){
        return {
            msg : "I want to play a game1"
        }
    }

}
</script>