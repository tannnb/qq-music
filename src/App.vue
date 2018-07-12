<template>
  <div id="app">
    <router-view/>
    <Player></Player>
    <vue-ins-progress-bar></vue-ins-progress-bar>
  </div>
</template>

<script>
  import Player from './views/player/player'
  import {mapGetters} from 'vuex'

  export default {
    name: 'App',
    components: {
      Player
    },
    mounted() {
      this.$insProgress.finish()
    },
    computed: {
      ...mapGetters(['fullScreen'])
    },
    watch: {
      fullScreen(newValue) {
        let abody = document.getElementsByTagName('body')[0]
        if (newValue == true) {
          this.$nextTick(() => {
            if (this.fullScreen) {
              abody.classList.add('noneScorllY')
            }
          })
        } else {
          abody.classList.remove('noneScorllY')
        }
      }
    },
    created() {
      this.$insProgress.start()

      this.$router.beforeEach((to, from, next) => {
        this.$insProgress.start()
        next()
      })

      this.$router.afterEach((to, from) => {
        this.$insProgress.finish()
      })
    }
  }
</script>
<style lang="stylus">

  body {
    overflow-x hidden
  }

  .noneScorllY {
    overflow-y hidden
  }

  .paddingBtoom {
    padding-bottom 100px
  }

</style>
