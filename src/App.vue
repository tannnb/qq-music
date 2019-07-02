<template>
    <div id="app">
        <keep-alive>
            <router-view/>
        </keep-alive>
        <Player/>
        <Back-top/>
    </div>
</template>

<script>
import axios from 'axios'
import Player from '@/views/player/player'
import BackTop from '@/components/backTop'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Player,
    BackTop
  },
  computed: {
    ...mapGetters(['fullScreen'])
  },

  watch: {
    fullScreen (newValue) {
      let abody = document.getElementsByTagName('body')[0]
      if (newValue === true) {
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
  mounted () {
    let full_hook = document.getElementById('fullwrapper')
    if (full_hook !== null) {
      this.$nextTick(() => {
        document.body.removeChild(full_hook)
      })
    }
    let OriginTitile = document.title
    let titleTime
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.title = '欢迎下次再来！'
        clearTimeout(titleTime)
      } else {
        document.title = '欢迎回来!'
        titleTime = setTimeout(() => {
          document.title = OriginTitile
        }, 2000)
      }
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
