<template>
  <div>
    <Music-header @handleSelect="handleSelect" :currentIndex="currentIndex"></Music-header>
    <Music-nav></Music-nav>

    <router-view></router-view>
  </div>
</template>

<script>
  import MusicHeader from '../../components/music-header/music-header'
  import MusicNav from '../../components/music-nav/music-nav'
  export default {
    data() {
      return {
        currentIndex: 0
      }
    },
    components: {
      MusicHeader,
      MusicNav
    },
    methods: {
      handleSelect(items) {
        this.currentIndex = Number(items.id)
      }
    }
  }
</script>

<style lang="stylus" scoped>



</style>
