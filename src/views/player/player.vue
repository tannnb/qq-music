<template>
  <div class="player-wrapper" v-if="playlist.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%"  :src="currentSong.image">
      </div>
      <div class="playerSet" @click="back">
       <span class="mins"> <i class="icon-minWin" ></i> 最小化</span>
      </div>

      <div class="playerContainer">
        <div class="playerNav">
            <span> <i class="icon-sound"></i> 收藏</span>
            <span> <i class="icon-add"></i> 添加</span>
            <span> <i class="icon-clearall"></i> 清空</span>
        </div>
        <div class="playerlyer">

        </div>
      </div>


      <div class="player_music">
        <div class="playerStart">
          <i class="icon-prev"></i>
          <i :class="playIcon" @click="togglePlaying"></i>
          <i class="icon-next"></i>
        </div>
        <div class="progress-wrapper">
          <div class="header">
            <div class="musicName">{{currentSong.name}}-{{currentSong.singer}}</div>
            <div class="musictime">{{currentTime}}/{{currentSong.duration}}</div>
          </div>
          <div></div>
        </div>
      </div>

    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">mini</div>
    <audio ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "player",
    data(){
      return {
        currentTime:0
      }
    },
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
      background rgb(52, 52, 52)
      .background{
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.2
        filter: blur(20px)
      }
      .playerSet{
        display flex
        justify-content flex-end
        width 1100px
        padding 10px 0
        margin 0 auto
        color: #898989
        .mins{
          padding-left 10px
          font-size 14px
          cursor pointer
          i{
            font-size 18px
          }
          &:hover{
            color: #fff
          }
        }
      }
      .playerNav{
        display flex
        width 1100px
        padding 10px 0
        margin 0 auto
        span {
          padding 10px 30px
          color: #979797
          margin-right 10px
          font-size 14px
          border:1px solid rgba(255, 255, 255, 0.23)
          cursor pointer
          &:hover{
            color #fff
            border:1px solid rgb(255, 255, 255)
          }
        }
      }


      .player_music{
        position: absolute
        bottom 50px
        left: 50%
        display flex
        transform translateX(-50%)
        width 1100px
        margin 0 auto
        .playerStart{
          display flex
          justify-content space-between
          width 120px
          color: #fff
          i{
            font-size 26px
          }
        }
        .progress-wrapper{
          padding 0 30px
          width 460px
          color: #fff
          .header{
            display flex
            justify-content space-between
            font-size 13px
            .musicName{
              color rgba(225,225,225,.8)
            }
            .musictime{
              color rgba(225,225,225,.8)
            }
          }
        }
      }
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
