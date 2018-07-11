<template>
  <div id="app">
    <router-view/>
    <Player></Player>
  </div>
</template>

<script>
import Player from './views/player/player'
  export default {
    name: 'App',
    components:{
      Player
    }
  }
</script>
<style lang="stylus">

  body {
    overflow-x hidden
  }

</style>
