<template>
  <div class="player-wrapper" v-show="playlist.length>0">
    <div class="normal-player" v-show="fullScreen">

      <i class="icon-minWin" @click="back"></i>
      <i :class="playIcon" @click="togglePlaying"></i>

    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">mini</div>
    <audio ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "player",
    computed: {
      ...mapGetters(['fullScreen', 'playlist', 'currentSong', 'playing']),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      }
    },
    methods: {
      ...mapMutations({
        setFullscreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE'
      }),
      back() {
        this.setFullscreen(false)
      },
      open() {
        this.setFullscreen(true)
      },
      togglePlaying() {
        this.setPlayState(!this.playing)
      }
    },
    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newplaying) {
        this.$nextTick(() => {
          const auido = this.$refs.audio
          newplaying ? auido.play() : auido.pause()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .player-wrapper {
    .normal-player {
      position: fixed
      top: 0
      bottom: 0
      width 100%
      z-index 99
      background #ccc
    }
    .mini-player {
      position: fixed
      bottom: 0
      z-index 99
      width 100%
      height: 100px
      background #ddd
    }
  }

</style>
