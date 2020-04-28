<template>
    <div :id="$attrs.id">
       <h3>{{ msg }}</h3> 
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    data(){
        return {
            msg : "I am Graph!"
        }
    }
}
</script>