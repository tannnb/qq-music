<template>
  <div class="singer-desc">
    <div class="singerWrapper">
      <div class="logo"><img :src="initDisc.singer_pic" alt=""></div>
      <div class="singerItem">
        <div class="dissname">{{initDisc.singer_name}}</div>
        <div class="tags"><i class="icon-user"></i> {{initDisc.country}}</div>
        <div class="tags" v-if="singerInfo">单曲：{{singerInfo.total}}</div>
        <div class="tags">收藏量：</div>
        <div class="funBtn">
          <span class="active"
                :class=" songs.length === 0? 'notSong':'' "
                @click="handlePlayAll"
          > <i class="icon-play"></i> 播放歌手热门歌曲</span>
          <span><i class="icon-collect"></i>收藏</span>
        </div>
      </div>
    </div>

    <div class="list-wrapper">
      <List-view
        class="singerContentList"
        v-if="songs.length !== '' "
        :song="songs"
        @handlePlayer="handlePlayer"
        @appendPlayer="appendPlayer"
      ></List-view>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getSingerDesc, getSingerAlbum, getSingerMv} from '../../api/singer'
  import {ERR_OK} from "../../api/config";
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'


  export default {
    data() {
      return {
        singerlist: null,
        singerInfo: '',
        songs: []
      }
    },
    components: {
      ListView,
      reviewList
    },
    created() {
      this._getSingerDesc()
      // this._getSingerAlbum()
      this._getSingerMv()
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      // 追加歌曲
      appendPlayer() {

      },
      handlePlayer(items, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      handlePlayAll() {
        if (this.songs.length === 0) {
          return false
        }
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },
      _getSingerDesc() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        getSingerDesc(this.mid).then(res => {
          if (res.data.code === ERR_OK) {
            this.singerInfo = res.data.data
            this.singerlist = res.data.data.list
            processSongsUrl(this._normalizeSongs(res.data.data.list)).then((songs) => {
              //  排除没有url的歌曲
              this.songs = songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
            })
          }
        })
      },

      _getSingerAlbum() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        getSingerAlbum(this.mid).then(res => {
          console.log(res)
        })
      },
      _getSingerMv() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        getSingerMv(this.mid).then(res => {
          let ret = res.data
          const reg = /\((\{.+\})\)/
          const matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
          }
          console.log(ret)
        })
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData.musicData)) {
            ret.push(createSong(musicData.musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .singer-desc {
    width 1200px
    margin 0 auto
    .singerWrapper {
      display flex
      padding 40px 0 35px 0
      .logo {
        width 250px
        height 250px
        border-radius 50%
        overflow hidden
        img {
          width 100%
          vertical-align top
        }
      }
      .singerItem {
        padding-left 40px
        .dissname {
          padding-top 13px
          padding-bottom 10px
          font-size 32px
        }
        .tags {
          font-size 15px
          padding 6px 0
        }
        .funBtn {
          span {
            display inline-block
            border: 1px solid #c9c9c9
            padding 10px 30px
            margin 20px 0
            font-size 15px
            color: #333
            border-radius 2px
            cursor pointer
            &:hover {
              background #EDEDED
            }
          }
          .active {
            background #31c27c
            color: #fff
            border-color #31c27c
            &:hover {
              background #2CAF6F
            }
            &.notSong {
              border-color #848484
              user-select none
            }
          }

        }

      }

    }

    .list-wrapper {
      display flex
      .singerContentList {
        .list-view {
          width 100% !important
        }
      }
      .introduction {
        padding-left 30px
        .name {
          font-size: 15px
          font-weight: 400
          line-height: 46px
        }
        .desc {
          max-height: 88px
          font-size: 14px
          line-height: 22px
          overflow: hidden
        }

      }
    }

  }

</style>
