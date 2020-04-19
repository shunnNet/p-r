<template>
    <div>
       <h3>{{ msg }}</h3> 
       <h4> {{mother}} </h4>
    </div>
</template>

<script>
export default {
    
    data(){
        return {
            msg : "I am Config!"
        }
    },
    props: ["mother"] 
}
</script>