<template>
  <div class="singer-desc">
    <div class="singerWrapper"  v-if="singerInfo">
     <div class="logo"><img  :src="uri(singerInfo.singer_mid,true)" alt=""></div>
      <div class="singerItem" >
        <div class="dissname">{{singerInfo.singer_name}}</div>
        <div class="singerTotal">
          <div class="" v-if="singerInfo">单曲<span class="weight">{{singerInfo.total}}</span></div>
          <div class="">专辑<span class="weight">{{singer_ablum.total}}</span></div>
          <div class="">MV<span class="weight">{{singer_mv.total}}</span></div>
        </div>
        <div class="funBtn">
          <span class="active"
                :class=" songs.length === 0? 'notSong':'' "
                @click="handlePlayAll"
          > <i class="icon-play"></i> 播放歌手热门歌曲</span>
          <span class="music_num"> <i class="icon-add"></i> 关注{{music_num | listen}}</span>
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

    <div class="singer_ablum">
      <h4 class="header">专辑</h4>
      <ul class="content">
        <li v-for="(items,index) in singer_ablum.list"
            :key="index"
            class="items">
          <img class="avatar" :src="uri(items.albumMID)" alt="">
          <p class="albumName">{{items.albumName}}</p>
          <p class="pubTime">{{items.pubTime}}</p>
        </li>
      </ul>
    </div>
    <div class="singer_ablum">
      <h4 class="header">MV</h4>
      <ul class="content">
        <li v-for="(items,index) in singer_mv.list"
            :key="index"
            class="items">
          <img class="pic" :src="items.pic" alt="">
          <p class="albumName">{{items.title}}</p>
          <p class="pubTime">{{items.listenCount | listen}}</p>
        </li>
      </ul>
    </div>

    <Loading v-if="songs.length === 0"></Loading>
    <vue-progress-bar></vue-progress-bar>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getSingerDesc, getSingerAlbum, getSingerMv,gerSingerFan} from '../../api/singer'
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import Loading from '../../components/loading/loading'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'



  export default {
    data() {
      return {
        singerlist: null,
        singerInfo: null,
        songs: [],
        singer_ablum: {},
        singer_mv:{},
        music_num:null
      }
    },
    components: {
      ListView,
      reviewList,
      Loading
    },
    created() {
      this.$Progress.start()
      this._getSingerDesc()
      this._getSingerAlbum()
      this._getSingerMv()
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    filters:{
      listen(count){
        return paddListenCount(count)
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      uri(uri,flag) {
        let count = flag? '1':'2'
        return `https://y.gtimg.cn/music/photo_new/T00${count}R300x300M000${uri}.jpg?max_age=2592000`
      },
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
            this.$Progress.finish()
          }
        })
        gerSingerFan(this.mid).then(res => {
          this.music_num =  res.data.data.music_num
        })
      },

      _getSingerAlbum() {
        if (!this.mid) {
          this.$router.push('/music/singer')
          return
        }
        getSingerAlbum(this.mid).then(res => {
          if (res.data.code === ERR_OK) {
            this.singer_ablum = res.data.data
          }
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
          if(ret.code === ERR_OK){
            this.singer_mv = ret.data
          }
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
    background: linear-gradient(#f3f3f3, #fff);
    .singerWrapper {
      width 1200px
      margin 0 auto
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
        .singerTotal{
          display flex
          padding-top 30px
          font-size 15px
          color: #797676
          cursor pointer
          div{
            margin-right  20px
            &:hover{
              color: #31c27c
            }
          }
          .weight{
            padding-left 6px
            font-size 26px
            font-family  'arial'
          }
        }
        .funBtn {
          span {
            display inline-block
            border: 1px solid #ccc
            padding 10px 30px
            margin 20px 0
            font-size 15px
            color: #7d7b7b
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
            width 224px
            cursor pointer
            img {
              width 100%
              vertical-align top
            }
          }
          .pic{
            width 224px
            height:126px
            img{
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
  }

</style>

