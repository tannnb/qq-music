<template>
  <div class="player-wrapper" v-if="playlist.length>0">

    <!-- 最大化 -->
    <transition name="fade">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="playerSet">
          <span class="mins" @click.stop="back"> <i class="icon-minWin"></i> 最小化</span>
        </div>

        <div class="playerContainer">
          <div class="playerNav">
            <span> <i class="icon-collect"></i> 收藏</span>
            <span> <i class="icon-add"></i> 添加</span>
            <span> <i class="icon-clearall"></i> 清空</span>
          </div>
          <div class="playerlyer">
            <div class="playerlist-Wrapper">
              <player-list></player-list>
            </div>
          </div>
        </div>

        <!-- 控制区域 -->
        <div class="player_music">
          <div class="playerStart">
            <span :class="disableCls"><i class="icon-prev" @click="prev"></i></span>
            <span :class="disableCls"><i :class="playIcon" @click="togglePlaying"></i></span>
            <span :class="disableCls"><i class="icon-next" @click="next"></i></span>
          </div>
          <div class="progress-wrapper">
            <div class="header">
              <div class="musicName">{{currentSong.name}}-{{currentSong.singer}}</div>
              <div class="musictime">{{format(currentTime)}} / {{format(currentSong.duration)}}</div>
            </div>
            <div>
              <Progress-bar :percent="percent" @percentChange="onPercentChange"></Progress-bar>
            </div>
          </div>
          <div class="playerFun">
            <div class="iconwrapper">
              <i class="icon-cycle"></i>
              <i class="icon-collect"></i>
              <i class="icon-down"></i>
              <i class="icon-sound"></i>
            </div>
            <div>
            </div>
          </div>
        </div>

      </div>
    </transition>


    <!-- 最小化 -->
    <div class="mini-player" v-show="!fullScreen">
      <div class="avatar" @click="open"><img :src="currentSong.image" alt=""></div>
      <div class="mini-progress">
        <div class="header">
          <div class="musicName">{{currentSong.name}}-{{currentSong.singer}}</div>
          <div class="musictime">{{format(currentTime)}}/{{format(currentSong.duration)}}</div>
        </div>
        <div></div>
      </div>
      <div class="playerState">
        <i :class="playIcon" @click="togglePlaying"></i>
      </div>
    </div>

    <audio ref="audio"
           :src="currentSong.url"
           @canplay="read"
           @error="error"
           @ended="end"
           @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import PlayerList from '../../components/player-list/player-list'
  import ProgressBar from '../../components/progress-bar/progress-bar'

  export default {
    name: "player",
    data() {
      return {
        currentTime: 0,
        songReady: false
      }
    },
    components: {
      PlayerList,
      ProgressBar
    },
    computed: {
      ...mapGetters(['fullScreen', 'playlist', 'currentSong', 'playing', 'currentIndex']),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      disableCls() {
        return this.songReady ? '' : 'disableCls'
      },
      // 获取播放比例
      percent() {
        return this.currentTime / this.currentSong.duration
      }
    },
    methods: {
      ...mapMutations({
        setFullscreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENTINDEX'
      }),
      back() {
        this.setFullscreen(false)
      },
      open() {
        this.setFullscreen(true)
      },
      // 播放 暂停
      togglePlaying() {
        this.setPlayState(!this.playing)
      },
      // 上一曲
      prev() {
        if (!this.songReady) {
          return false
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      },
      // 下一曲
      next() {
        if (!this.songReady) {
          return false
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
        this.$refs.audio.volume = 0.5
      },

      // 缓冲完成
      read() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      end() {
        this.next()
      },
      // 获取播放的时间
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },

      // 音量
      volume() {
      },

      onPercentChange(percent) {
        // 设置歌曲位置
         this.$refs.audio.currentTime = this.currentSong.duration * percent
        if (!this.playing) {
          this.togglePlaying()
        }
      },

      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },

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
      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.2s linear
      }
      &.fade-enter, &.fade-leave-to {
        opacity 0
      }

      .background {
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.2
        filter: blur(20px)
      }

      .playerSet {
        position: absolute
        top: 10px
        left: 50%
        transform translateX(-50%)
        display flex
        justify-content flex-end
        width 90%
        padding 10px 0
        color: #898989
        .mins {
          padding-left 10px
          font-size 14px
          cursor pointer
          i {
            font-size 18px
          }
          &:hover {
            color: #fff
          }
        }
      }

      .playerContainer {
        position: absolute
        top: 50px
        bottom: 90px
        left: 50%
        transform translateX(-50%)
        width 90%
        overflow hidden
        .playerNav {
          display flex
          padding 10px 0
          margin 0 auto
          span {
            padding 10px 30px
            color: #979797
            margin-right 10px
            font-size 14px
            border: 1px solid rgba(255, 255, 255, 0.23)
            cursor pointer
            &:hover {
              color #fff
              border: 1px solid rgb(255, 255, 255)
            }
          }
        }

        .playerlyer {
          display flex
          height: 100%
          .playerlist-Wrapper {
            width 80%
            height: 100%
            overflow-y auto
          }
        }
      }

      .player_music {
        position: absolute
        bottom 50px
        left: 50%
        transform translateX(-50%)
        display flex
        width 90%
        .playerStart {
          display flex
          justify-content space-between
          width 120px
          color: #9e9e9e
          .disableCls {
            color: #717171
          }
          i {
            font-size 26px
            cursor pointer
            &:hover {
              color: #fff
            }
          }
        }
        .progress-wrapper {
          flex 1
          padding 0 30px
          color: #fff
          .header {
            display flex
            justify-content space-between
            font-size 13px
            .musicName {
              color rgba(225, 225, 225, .8)
            }
            .musictime {
              color rgba(225, 225, 225, .8)
            }
          }
        }
        .playerFun {
          flex 0 0 500
          width 500px
          .iconwrapper {
            display flex
            align-items center
            padding-left 20px
            i {
              font-size 26px
              padding 0 4px
              margin 0 10px
              color: #9e9e9e
              cursor: pointer
              &:hover {
                color: #fff
              }
            }
          }
        }
      }
    }

    .mini-player {
      display flex
      justify-content center
      position: fixed
      bottom: 10px
      left: 50%
      transform translateX(-50%)
      z-index 99
      width 76%
      padding 10px 20px
      background #fff
      border: 1px solid #d4d4d4
      box-shadow 0 0 4px #cacaca
      .avatar {
        flex 0 0 100
        width 60px
        height: 60%
        cursor pointer
        img {
          width 100%
          vertical-align top
        }
      }
      .mini-progress {
        flex 1
        padding 0 60px 0 30px
        .header {
          display flex
          justify-content space-between
          padding-top 10px
          font-size 13px
          color #4f504f
          .musicName {
          }
          .musictime {
          }
        }
      }
      .playerState {
        display flex
        align-items center
        justify-content center
        flex 0 0 100
        width 100px
        text-align center
        i {
          color: #31c27c
          font-size 30px
          cursor pointer
        }
        .icon-play {
          font-size 40px
        }
      }
    }
  }

</style>
