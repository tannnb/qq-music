<template>
  <div>
    <Music-header @handleSelect="handleSelect" :currentIndex="currentIndex"></Music-header>
    <Music-nav></Music-nav>

    <router-view :class=" fullScreen === false? 'bottomPad':'' "></router-view>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
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
    computed:{
      ...mapGetters(['fullScreen'])
    },
    methods: {
      handleSelect(items) {
        this.currentIndex = Number(items.id)
      }
    }
  }
</script>

<style lang="stylus" scoped>

.bottomPad{
  padding-bottom 120px
}


</style>
