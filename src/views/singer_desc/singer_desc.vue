<template>
  <div class="singer-desc">
    <div class="singerWrapper" v-if="singerInfo">
      <div class="logo"><img :src="uri(singerInfo.singer_mid,true)" alt=""></div>
      <div class="singerItem">
        <div class="dissname">{{singerInfo.singer_name}}</div>
        <div class="singerTotal">
          <div class="" v-if="singerInfo">单曲<span class="weight">{{singerInfo.total}}</span></div>
          <div class="">专辑<span class="weight">{{singer_ablum.total}}</span></div>
          <div class="">MV<span class="weight">{{singer_mv.total}}</span></div>
        </div>
        <div class="funBtn">
          <div class="funBtn-Btn"
               :class="songs && songs.length === 0? 'notSong':'active'"
               @click="handlePlayAll">
            <i class="icon-play"></i><span>播放歌手热门歌曲</span>
          </div>
          <div class="funBtn-Btn">
            <i class="icon-add"></i><span>关注{{music_num | listen}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="list-wrapper">
      <baidu-foldable style="width: 100%" height="%30" async>
        <List-view
          class="singerContentList"
          v-if="songs.length !== '' "
          :song="songs"
          @handlePlayer="handlePlayer"
          @appendPlayer="appendPlayer"
        />
      </baidu-foldable>
    </div>

    <div class="singer_ablum">
      <h4 class="header">专辑</h4>
      <ul class="content">
        <li v-for="(items,index) in singer_ablum.list"
            :key="index"
            class="items">
          <div class="avatar">
            <Avatar-hover :avatarUri="uri(items.albumMID)"></Avatar-hover>
          </div>
          <p class="albumName">{{items.albumName}}</p>
          <p class="pubTime">{{items.pubTime}}</p>
        </li>
      </ul>
    </div>
    <div class="singer_ablum">
      <h4 class="header">MV</h4>
      <ul class="content">
        <li v-for="(items,index) in singer_mv.list"
            :key="items.id"
            @click="handleSelectMV(items)"
            class="items">
          <div class="avatar">
            <Avatar-hover :avatarUri="items.pic"></Avatar-hover>
          </div>
          <p class="albumName">{{items.title}}</p>
          <p class="pubTime">{{items.listenCount | listen}}</p>
        </li>
      </ul>
    </div>

    <vue-progress-bar></vue-progress-bar>

    <transition name="fade">
     <div class="dplayer" v-if="showDplayer">
       <div class="close-Dplayer"><i @click="closeplayer" class="icon-delete"></i></div>
       <div ref="dplayer" ></div>
     </div>
    </transition>

  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {getSingerDesc, getSingerAlbum, getSingerMv, gerSingerFan,getSingerMvUrl} from '../../api/singer'
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'
  import {LoadingMixin} from "../../utils/mixin"
  import AvatarHover from '../../components/AvatarHover/AvatarHover'
  import DPlayer from 'DPlayer';

  export default {
    mixins: [LoadingMixin],
    data() {
      return {
        singerlist: null,
        singerInfo: null,
        songs: [],
        singer_ablum: {},
        singer_mv: {},
        music_num: null,
        freeflow_url:[],
        showDplayer:false,
        options:{}
      }
    },
    components: {
      ListView,
      reviewList,
      AvatarHover
    },
    created() {
      this._getSingerDesc()
      this._getSingerAlbum()
      this._getSingerMv()
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      }
    },
    methods: {
      ...mapActions([
        'selectPlay',
        'insertSong'
      ]),
      ...mapMutations({
        setPlayState: 'SET_PLAYING_STATE'
      }),
      uri(uri, flag) {
        let count = flag ? '1' : '2'
        return `https://y.gtimg.cn/music/photo_new/T00${count}R300x300M000${uri}.jpg?max_age=2592000`
      },
      // 追加歌曲
      appendPlayer(items) {
        this.insertSong(items)
      },

      handlePlayer(items, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },

      copyrightIssue(message) {
        var vm = this
        this.CreateDialog({
          message: message ? message : '抱歉，因版权限制,暂无法查看该歌手下歌曲！',
          confirmBtnText: '返回专辑页面',
          cancelBtn: false,
          showClose: true,
          confirmBtn() {
            vm.$router.push('/music/singer')
          },
          close() {
            vm.$router.push('/music/singer')
          }
        })
      },

      handlePlayAll() {
        if (this.songs.length === 0) {
          this.copyrightIssue()
          return false
        }
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },

      async _getSingerDesc() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('歌手信息加载中，请稍后...')
        if (!this.mid) {
          this.$Progress.finish()
          this.showLoading.hide()
          this.$router.push('/music/singer')
          return
        }

        try {
          const response = await getSingerDesc(this.mid)
          if (response.data.code === ERR_OK) {
            this.singerInfo = response.data.data
            this.singerlist = response.data.data.list

            // 获取播放地址
            try {
              const result = await processSongsUrl(this._normalizeSongs(response.data.data.list))
              //  排除没有url的歌曲
              this.songs = result.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
              this.$Progress.finish()
              this.showLoading.hide()
            } catch (e) {
              this.$Progress.finish()
              this.showLoading.hide()
              this.copyrightIssue()
            }
          }
        } catch (e) {
          this.$Progress.finish()
          this.showLoading.hide()
          this.copyrightIssue()
        }

        // 获取MV
        try {
          const response = await gerSingerFan(this.mid)
          this.music_num = response.data.data.music_num
        } catch (e) {
          this.CreateDialog({
            message: 'MV获取失败'
          })
        }
      },

      async _getSingerAlbum() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        try {
          const response = await getSingerAlbum(this.mid)
          if (response.data.code === ERR_OK) {
            this.singer_ablum = response.data.data
          }
        } catch (e) {
          this.CreateDialog({
            message: '歌手详情获取失败'
          })
        }
      },
      async _getSingerMv() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        try {
          const response = await getSingerMv(this.mid)
          let ret = response.data
          const reg = /\((\{.+\})\)/
          const matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1])
          }
          if (ret.code === ERR_OK) {
            this.singer_mv = ret.data
          }
        } catch (e) {
          this.CreateDialog({
            message: 'MV获取失败'
          })
        }
      },

      async handleSelectMV(items){
        const vid = items.vid
        const response = await getSingerMvUrl(vid)
        if(response.data.code === ERR_OK){
          const MvUrlData = response.data.getMvUrl
          if(MvUrlData.code === ERR_OK){
            const mvUrl_mp4 = MvUrlData.data[vid].mp4

            const result = []
            for(let i=0;i<mvUrl_mp4.length;i++){
              if(mvUrl_mp4[i].freeflow_url.length !== 0){
                for(let j=0;j<mvUrl_mp4[i].freeflow_url.length;j++){
                  result.unshift(mvUrl_mp4[i].freeflow_url[j])
                }
              }
            }

           if(result.length === 0){
             this.CreateDialog({
               message: message ? message : '该歌手MV因版权问题,暂时无法播放！',
               confirmBtnText: '取消',
               cancelBtn: false
             })
              return
           }

            this.showDplayer = true
            this.setPlayState(false)
            this.$nextTick(() => {
              const dp = new DPlayer({
                container:this.$refs.dplayer,
                video: {
                  url: result[0],
                  pic: items.pic
                },
                autoplay: false
              })
            })
          }
        }
      },

      closeplayer(){
        this.showDplayer = false
        this.setPlayState(true)
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


  .vue-foldable-container {
    transition: max-height 0.3s;
  }

  .vue-foldable-mask {
    transition: opacity 3s;
  }

  .singer-desc {
    background: linear-gradient(#f3f3f3, #fff);
    .singerWrapper {
      width 1200px
      margin 0 auto
      display flex
      padding 40px 0 35px 0
      .logo {
        width 250px
        height 250px
        overflow hidden
        img {
          width 100%
          vertical-align top
        }
      }
      .singerItem {
        padding-left 60px
        .dissname {
          padding-top 40px
          padding-bottom 10px
          font-size 32px
        }
        .tags {
          font-size 15px
          padding 6px 0
          color: #888787
        }
        .singerTotal {
          display flex
          padding-top 30px
          font-size 15px
          color: #797676
          cursor pointer
          div {
            margin-right 20px
            &:hover {
              color: #31c27c
            }
          }
          .weight {
            padding-left 6px
            font-size 26px
            color #494949
            font-family 'arial'
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

    .singer_ablum {
      width 1200px
      margin 0 auto
      .header {
        padding 12px 0 4px 0
        font-size 20px
        line-height 60px
        font-weight 700
        font-family "Microsoft YaHei UI"
      }
      .content {
        display flex
        justify-content space-between
        .items {
          width 20%
          .avatar {
            width 100%
          }
          .pic {
            width 224px
            height: 126px
            img {
              width 100%
              vertical-align top
            }
          }
          .albumName {
            padding 12px 0 8px 0
            font-size 14px
            color: #333
            cursor pointer
            text-overflow ellipsis
            white-space nowrap
            overflow hidden
            &:hover {
              color: #31c27c
            }
          }
          .pubTime {
            color: #999
            font-size 12px
          }
        }
      }
    }
    .dplayer{
      position: fixed
      top: 0
      bottom: 0
      width 100%
      z-index 100
      background rgb(52, 52, 52)
      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }
      &.fade-enter, &.fade-leave-to {
        opacity 0
      }
      .close-Dplayer{
        position: fixed
        top: 30px
        right 30px
        color: #fff
        z-index: 102
        .icon-delete{
          font-size 34px
          color: rgba(255, 255, 255, 0.5)
          cursor: pointer
          &:hover{
            color: #fff
          }
        }
      }
    }
  }

</style>

