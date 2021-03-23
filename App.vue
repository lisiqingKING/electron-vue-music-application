<template>
  <div id="app" style="background: url('E:/DB_SOURCE/BKS/bk1.jpg'); background-repeat: space;  background-size: cover;">
    <router-view :key="key"></router-view>
  </div>
</template>

<script>
import palyer from "../renderer/components/player.js"
import player from '../renderer/components/player.js';
  export default {
    name: 'my-project2.0',
    data:function(){
      return {
        style:""
      }
    },
    computed:{
      key(){
        //加上key
        return this.$route.name ? this.$route.name + new Date() : this.$route + new Date()
      }
    },
    beforeMount() {
       player.aboutInit()
     
    },
    mounted() {
      player.getVueThis(this)
    },
    watch:{
      "$router":function(to,from,next) {
        
      }
    }
   
   
  }
</script>

<style>
  /* CSS */
  
  #app{
    opacity: 0.9;
  }
</style>
