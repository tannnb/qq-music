<template>
  <div class="player-wrapper" v-if="playlist.length>0">

    <!-- 最大化 -->
    <transition name="fade">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="playerSet">
          <span class="mins" @click.stop="back"> <a-icon type="shrink" /></span>
        </div>

        <div class="playerContainer">
          <!--<div class="playerNav">
            <span> <i class="icon-collect"></i> 收藏</span>
            <span> <i class="icon-add"></i> 添加</span>
            <span> <i class="icon-clearall"></i> 清空</span>
          </div>-->
          <div class="playerlyer">
            <div class="playerlist-Wrapper">
              <player-list @handleSelectSong="handleSelectSong"></player-list>
            </div>
            <div class="playerSong-wrapper">
              <div class="songInfo">
                <div class="avatar">
                  <img :src="currentSong.image">
                </div>
                <div class="name">歌曲名:{{currentSong.name}}</div>
                <div class="singer">歌手:{{currentSong.singer}}</div>
              </div>
              <div class="mark-scroll"></div>
              <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p ref="lyricLine"
                       class="text"
                       :class="{'current':currentLineNum === index}"
                       v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                  </div>
                  <div class="pure-music" v-show="isPureMusic">
                    <p>暂无歌词请欣赏...</p>
                  </div>
                </div>
              </Scroll>
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
              <div class="musictime">{{currentTime | formats}} / {{currentSong.duration | formats}}</div>
            </div>
            <div>
              <Progress-bar ref="maxProgress" :percent="percent" @percentChange="onPercentChange"></Progress-bar>
            </div>
          </div>
          <div class="playerFun">
            <div class="iconwrapper">
              <div @click="changeMode"><i :class="iconMode"></i></div>
              <i class="icon-collect" :class="favoriteIcon" @click="toggleFavorite(currentSong)"></i>
              <div style="display: flex">
                <i :class="iconMute" @click="toggleMute"></i>
                <Progress-bar style="width: 120px" :percent="volume"
                              @percentChange="onPercentvolumeChange"></Progress-bar>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>

      </div>
    </transition>


    <!-- 最小化 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen">
        <div class="avatar" @click.stop="open"><img :class="cdCls" :src="currentSong.image"></div>
        <div class="mini-progress">
          <div class="header">
            <div class="musicName">{{currentSong.name}}-{{currentSong.singer}}</div>
            <div class="playingLyric">{{playingLyric}}</div>
            <div class="musictime">{{currentTime | formats}}/{{currentSong.duration | formats}}</div>
          </div>
          <div>
            <Progress-bar ref="miniProgress" :percent="percent" @percentChange="onPercentChange"></Progress-bar>
          </div>
        </div>
        <div class="playerState">
          <span :class="disableCls"><i class="icon-prev" @click="prev"></i></span>
          <span :class="disableCls"><i :class="playIcon" @click="togglePlaying"></i></span>
          <span :class="disableCls"><i class="icon-next" @click="next"></i></span>
        </div>
      </div>
    </transition>


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
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {playMode} from "../../api/config"
  import PlayerList from '../../components/player-list/player-list'
  import ProgressBar from '../../components/progress-bar/progress-bar'
  import Scroll from '../../components/scroll/scroll'
  import {shuffle} from "../../utils/util"
  import {format} from "../../utils/tool";
  import Lyric from 'lyric-parser'
  export default {
    name: "player",
    data() {
      return {
        currentTime: 0,
        songReady: false,
        volume: 1,
        isMute: true,
        currentLyric: null,
        currentLineNum: 0,
        isPureMusic: false,
        playingLyric: '歌词加载中...'
      }
    },
    components: {
      PlayerList,
      ProgressBar,
      Scroll
    },
    computed: {
      ...mapGetters(['fullScreen', 'playlist', 'currentSong', 'playing', 'currentIndex', 'mode', 'sequenceList', 'favoriteList']),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-queue' : this.mode === playMode.loop ? 'icon-cycle' : 'icon-round'
      },
      iconMute() {
        return this.isMute === true ? 'icon-sound' : 'icon-mute'
      },
      disableCls() {
        return this.songReady ? '' : 'disableCls'
      },
      // 获取播放比例
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      favoriteIcon() {
        return this.getFavoriteIcon(this.currentSong)
      }
    },
    methods: {
      ...mapMutations({
        setFullscreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENTINDEX',
        setPlayMode: 'SET_MODE',
        setPlaylist: 'SET_PLAYLIST'
      }),
      ...mapActions([
        'deleteFavoriteList',
        'saveFavoriteList'
      ]),
      back() {
        this.setFullscreen(false)
        this.$nextTick(() => {
          this.$refs.miniProgress.init()
        })
      },
      getFavoriteIcon(song) {
        if (this.isFavorite(song)) {
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      open() {
        this.setFullscreen(true)
        this.$nextTick(() => {
          this.$refs.maxProgress.init()
        })
      },
      // 播放 暂停
      togglePlaying() {
        if (!this.songReady) {
          return false
        }
        this.playingLyric = ''
        this.setPlayState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 上一曲
      prev() {
        if (!this.songReady) {
          return false
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      // 下一曲
      next() {
        if (!this.songReady) {
          return false
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      // 缓冲完成
      read() {
        this.songReady = true
      },
      error() {
        this.songReady = true
      },
      // 当前歌曲播放结束
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      // 循环
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 回到顶部
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 获取播放的时间
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      // 切换播放模式
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)   // 随机
        } else {
          list = this.sequenceList  // 顺序
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      // 获取歌词
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          this.isPureMusic = !this.currentLyric.lines.length
        }).catch(() => {
          this.playingLyric = '暂无歌词'
          this.currentLyric = null
          this.currentLineNum = 0
        })
      },
      getStateLyric() {
        this.currentSong.getStateLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          this.isPureMusic = !this.currentLyric.lines.length
        }).catch(() => {
          this.playingLyric = '暂无歌词'
          this.currentLyric = null
          this.currentLineNum = 0
        })
      },
      handleLyric({lineNum, txt}) {
        this.playingLyric = txt
        this.currentLineNum = lineNum
        if (lineNum > 3) {
          let lineEl = this.$refs.lyricLine[lineNum - 3]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
      // 播放歌曲
      handleSelectSong(index) {
        this.setCurrentIndex(index)
      },
      onPercentChange(percent) {
        // 设置歌曲位置
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        if (!this.playing) {
          this.togglePlaying()
        }
        // 拖动进度条，让歌词滚动到对应位置
        if (this.currentLyric) {
          const currentTime = this.$refs.audio.currentTime
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 音量
      onPercentvolumeChange(percent) {
        percent === 0 ? this.isMute = false : this.isMute = true
        this.volume = percent;
        this.$refs.audio.volume = percent.toFixed(1)
      },
      // 禁音/取消禁音
      toggleMute() {
        const cacheVolume = this.volume
        if (this.isMute) {
          this.isMute = false
          this.$refs.audio.volume = 0
        } else {
          this.isMute = true
          this.$refs.audio.volume = cacheVolume
        }
      },
      // 收藏
      toggleFavorite(currentSong) {
        if (this.isFavorite(currentSong)) {
          this.deleteFavoriteList(currentSong)
        } else {
          this.saveFavoriteList(currentSong)
        }
      },
      isFavorite(song) {
        const index = this.favoriteList.findIndex((item) => {
          return item.id === song.id
        })
        return index > -1
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (oldSong && newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      },
      playing(newplaying) {
        this.$nextTick(() => {
          const auido = this.$refs.audio
          newplaying ? setTimeout(() => auido.play(), 500) : auido.pause()
        })
      }
    },
    filters: {
      formats(times) {
        return format(times)
      }
    },
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
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
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
        right: 10px
        display flex
        justify-content flex-end
        width 90%
        color: #898989
        .mins {
          cursor pointer
          i {
            font-size 30px
          }
          &:hover {
            color: #fff
          }
        }
      }
      .playerContainer {
        position: absolute
        top: 60px
        bottom: 46px
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
          height: calc(100% - 56px)
          .playerlist-Wrapper {
            width 70%
            height: 100%
            overflow-y auto
          }
          .playerSong-wrapper {
            position: relative
            padding-left 30px
            flex 1
            width 30%
            justify-content center
            .songInfo {
              .avatar {
                position: relative;
                display: block;
                width: 186px;
                height: 186px;
                margin: auto;
                img {
                  width 100%
                  vertical-align top
                }
                &:after {
                  content: "";
                  position: absolute;
                  left: 9px;
                  top: 0;
                  width: 201px;
                  height: 180px;
                  background url("./album_cover_player.png") 0 0 no-repeat
                }
              }
              .name, .singer {
                padding-top 10px
                text-align center
                font-size 14px
                color: rgba(255, 255, 255, 0.5)
              }
            }
            .mark-scroll {
              position: absolute
              top:0
              left:0
              right: 0
              bottom: 0
              z-index 100
            }
            .middle-r {
              display: inline-block
              vertical-align: top
              width: 100%
              max-height: 200px
              margin-top 20px
              overflow: hidden
              .lyric-wrapper {
                width: 90%
                margin: 0 auto
                overflow: hidden
                text-align: center
                .text {
                  line-height: 28px
                  color: rgba(237, 237, 237, 0.3)
                  font-size: 13px
                  white-space nowrap
                  &.current {
                    color: #fff
                  }
                }
                .pure-music {
                  padding-top: 10px
                  line-height: 28px
                  color: rgba(255, 255, 255, 0.6)
                  font-size: 13px
                }
              }
            }
          }
        }
      }
      .player_music {
        position: absolute
        bottom 18px
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
            .icon-collect {
              &.icon-favorite {
                color: #fff
              }
              &.icon-not-favorite {
                color: #9e9e9e
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
      bottom: 0
     // left: 50%
      // transform translateX(-50%)
      z-index 99
      width 100%
      padding 10px 30px
     // margin 0 40px
      background #fff
      border: 1px solid #efefef
      box-sizing border-box

      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.2s
      }
      &.mini-enter, &.mini-leave-to {
        opacity 0
      }
      .avatar {
        flex 0 0 100
        width 60px
        height: 60%
        border-radius 50%
        cursor pointer
        overflow hidden
        img {
          width 100%
          vertical-align top
          &.play {
            animation: rotate 20s linear infinite
          }
          &.pause {
            animation-play-state: paused
          }
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
          .playingLyric {
            font-size 13px
            font-weight 400
            color #2a62ff
           /* order: 1px solid #2a62ff;
            background: -webkit-gradient(linear, left bottom, left top, from(#2a62ff), to(#4e7dff));
            background: linear-gradient(0deg, #2a62ff, #4e7dff);*/
          }
          .musictime {
          }
        }
      }
      .playerState {
        display flex
        align-items center
        justify-content center
        flex 0 0 180
        width 180px
        text-align center
        span {
          color: #d6d6d6
          font-size 30px
          cursor pointer
          &:hover {
            color: #2a62ff
          }
          &:nth-child(2) {
            margin 0 20px
          }
        }
        .icon-play {
        }
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
