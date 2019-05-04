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
          <div class="funBtn-Btn"
               :class="songs && songs.length === 0? 'notSong':'active'"
               @click="handlePlayAll">
            <i class="icon-play"></i><span>播放全部</span>
          </div>
          <div class="funBtn-Btn"><i class="icon-collect"></i><span>收藏</span></div>
          <div class="funBtn-Btn"><i class="icon-pinglun"></i><span>评论</span></div>
          <div class="funBtn-Btn"><i class="icon-more"></i><span>更多</span></div>
        </div>
      </div>
    </div>
    <div class="ablum_desc_singerlist">
      <div class="list-wrapper">
        <baidu-foldable style="width: 100%" height="%30" async>
          <List-view
            v-if="songs.length !== '' "
            :song="songs"
            @handlePlayer="handlePlayer"
            @appendPlayer="appendPlayer"
          />
        </baidu-foldable>
      </div>
    </div>
    <div class="list-wrapper" style="width: 860px">
      <!-- <review-list v-if="commentlist" :commentlist="commentlist" :commenttotal="commenttotal"></review-list>-->
    </div>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getAlbumDesc} from '../../api/album'
  import {review} from '../../api/disc'
  import {ERR_OK} from "../../api/config";
  import {processSongsUrl, isValidMusic, createSong} from "../../api/songList";
  import ListView from '../../components/list-view/list-view'
  import {LoadingMixin} from "../../utils/mixin"

  export default {
    mixins: [LoadingMixin],
    name: "album_desc",
    data() {
      return {
        albumInfo: [],
        songs: [],
        commentlist: null,
        commenttotal: '',
        notSongUrl: false
      }
    },
    components: {
      ListView
    },
    created() {
      this._getAlbumDesc()
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    methods: {
      ...mapActions([
        'selectPlay',
        'insertSong'
      ]),
      _addUri(mid) {
        try {
          return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
        }catch (e) {
          return ''
        }
      },

      copyrightIssue(message) {
        var vm = this
        this.CreateDialog({
          message: message ? message : '抱歉，因版权限制,暂无法查看该专辑下歌曲！',
          confirmBtnText: '返回专辑页面',
          cancelBtn: false,
          showClose:true,
          confirmBtn() {
            vm.$router.push('/music/album')
          },
          close() {
            vm.$router.push('/music/album')
          }
        })
      },

      async _getAlbumDesc() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('加载中，请稍后...')
        if (!this.mid) {
          this.$Progress.finish()
          this.showLoading.hide()
          this.$router.push('/music/album')
          return
        }

        try {
          const response = await getAlbumDesc(this.mid)

          // 版权问题 无法获取
          if (response.data.code === 404) {
            this.albumInfo = []
            this.$Progress.finish()
            this.showLoading.hide()
            this.copyrightIssue(response.data.data.albumTips)
            return
          }
          if(response.data.code === 1101){
            this.albumInfo = []
            this.$Progress.finish()
            this.showLoading.hide()
            this.copyrightIssue()
            return
          }

          if (response.data.code === ERR_OK) {
            this.notSongUrl = false
            this.albumInfo = response.data.data
            try {
              const result = await  processSongsUrl(this._normalizeSongs(response.data.data.list))
              this.songs = result.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
              this.$Progress.finish()
              this.showLoading.hide()
              /*
              // 获取评论
              review(this.mid).then(res => {
                console.log(res)
                if (res.data.code === ERR_OK) {
                  this.commentlist = res.data.comment.commentlist
                  this.commenttotal = res.data.comment.commenttotal
                }
              })*/
            } catch (e) {
              this.$Progress.finish()
              this.showLoading.hide()
              this.copyrightIssue()
            }
          }

        } catch (e) {
          this.showLoading.hide()
          this.$Progress.finish()
          this.copyrightIssue()
        }

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
        if (this.songs.length === 0) {
          this.copyrightIssue()
          return
        }
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
      appendPlayer(items) {
        this.insertSong(items)
      },

    }
  }
</script>

<style lang="stylus" scoped>
  .album_descWrapper {
    padding-top 40px
    background: linear-gradient(#f3f3f3, #fff);
    .ablum_desc_singerInfo {
      width 1200px
      margin 0 auto
      padding-bottom 40px
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
          display flex
          .funBtn-Btn {
            display flex
            justify-content center
            align-items center
            border: 1px solid #c9c9c9
            padding 10px 30px
            margin 20px 10px 20px 0
            font-size 15px
            color: #333
            border-radius 2px
            cursor pointer
            &.active {
              background #31c27c
              color: #fff
              border-color #31c27c
              &:hover {
                background #2CAF6F
              }
            }
            &.notSong {
              border-color #cfcfcf
              user-select none
              cursor: not-allowed
            }
            &:hover {
              background #EDEDED
            }
            i {
              font-size 18px
              padding-right 6px
            }
          }
        }
      }
    }
    .list-wrapper {
      width 1200px
      margin 0 auto
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

<!--//  https://y.gtimg.cn/music/photo_new/T002R300x300M000 00424Hth4cnV2N.jpg?max_age=2592000
//  https://y.gtimg.cn/music/photo_new/T002R300x300M00000424Hth4cnV2N.jpg?max_age=2592000

//  https://y.gtimg.cn/music/photo_new/T002R300x300M000 004TuCpJ0QiSvh.jpg?max_age=2592000-->
