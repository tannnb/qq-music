<template>
  <div class="album_descWrapper">
    <div class="ablum_desc_singerInfo" v-if="albumInfo">
      <div class="avatar">
        <img :src="_addUri(albumInfo.mid)" alt="">
        <i class="data__cover_mask"></i>
      </div>
      <div class="singerInfo">
        <h2 class="songName">{{albumInfo.name}}</h2>
        <div class="simgerName"><i class="icon-user"></i>{{albumInfo.singername}}</div>
        <ul class="singtag">
          <li>流派：{{albumInfo.genre}}</li>
          <li>语种：{{albumInfo.lan}}</li>
          <li>发行时间：{{albumInfo.aDate}}</li>
          <li>发行公司：{{albumInfo.company}}</li>
        </ul>
        <div class="funBtn">
          <span class="active"
                :class=" songs.length === 0? 'notSong':'' "
                @click="handlePlayAll"
          > <i class="icon-play"></i> 播放全部</span>
          <span><i class="icon-collect"></i>收藏</span>
          <span><i class="icon-pinglun"></i>评论</span>
          <span><i class="icon-more"></i>更多</span>
        </div>
      </div>
    </div>
    <div class="ablum_desc_singerlist">
      <div class="list-wrapper">
        <List-view
          v-if="songs.length !== '' "
          :song="songs"
          @handlePlayer="handlePlayer"
          @appendPlayer="appendPlayer"
        ></List-view>
      </div>
    </div>
    <div class="list-wrapper" style="width: 860px">
     <!-- <review-list v-if="commentlist" :commentlist="commentlist" :commenttotal="commenttotal"></review-list>-->
    </div>

    <Loading v-if="!albumInfo"></Loading>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getAlbumDesc} from '../../api/album'
  import {review} from '../../api/disc'
  import {ERR_OK} from "../../api/config";
  import {processSongsUrl, isValidMusic, createSong} from "../../api/songList";
  import ListView from '../../components/list-view/list-view'
  import Loading from '../../components/loading/loading'

  export default {
    name: "album_desc",
    data() {
      return {
        albumInfo: null,
        songs: [],
        commentlist: null,
        commenttotal: ''
      }
    },
    components: {
      ListView,
      Loading
    },
    created() {
      this._getAlbumDesc()
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      _addUri(mid) {
        return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
      },
      _getAlbumDesc() {
        if (!this.mid) {
          this.$router.push('/music/album')
          return
        }
        getAlbumDesc(this.mid).then(res => {
          if (res.data.code === ERR_OK) {
            this.albumInfo = res.data.data
            console.log(this.albumInfo)
            processSongsUrl(this._normalizeSongs(res.data.data.list)).then((songs) => {
              this.songs = songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
            })
            /*review(this.mid).then(res => {
              console.log(res)
              if (res.data.code === ERR_OK) {
                this.commentlist = res.data.comment.commentlist
                this.commenttotal = res.data.comment.commenttotal
              }
            })*/
          }
        })

      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      handlePlayAll() {
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },
      handlePlayer(items, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      appendPlayer() {

      }

    }
  }
</script>

<style lang="stylus" scoped>
  .album_descWrapper {
    width 1200px
    margin 0 auto
    .ablum_desc_singerInfo {
      position: relative
      display flex
      .avatar {
        flex 0 0 250
        width 250px
        img {
          width 100%
          vertical-align top
        }
        .data__cover_mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 282px;
          height: 250px;
          background url("./album_cover.png")
          pointer-events: none;
        }
      }
      .singerInfo {
        padding-left 80px
        .songName {
          padding 40px 0 10px 0
          font-size 30px
          font-weight 400
          font-family "poppin,Tahoma,Arial,\5FAE\8F6F\96C5\9ED1,sans-serif"
        }
        .simgerName {
          padding 10px 0
          font-size 15px
          color: #333
        }
        .singtag {
          display flex
          flex-wrap wrap
          li {
            width 50%
            font-size 15px
            line-height 30px
            color: #333
            font-family 'Microsoft YaHei UI'
          }
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
