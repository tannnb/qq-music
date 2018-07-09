<template>
  <div class="disc-wrapper">
    <div class="singerWrapper">
      <div class="logo"><img :src="playList.logo" alt=""></div>
      <div class="singerItem">
        <div class="dissname">{{playList.dissname}}</div>
        <div class="tags">{{playList.nickname}}</div>
        <div class="tags" v-if="playList.tags">标签:{{playList.tags[0].name}}</div>
        <div class="tags">播放量：{{_paddListen(playList.visitnum)}}</div>
         <div class="tags">收藏量：</div>
        <div class="funBtn">
          <span class="active">播放全部</span>
          <span>收藏</span>
          <span>评论</span>
          <span>更多</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {ERR_OK} from "../../api/config";
  import {getDiscList} from '../../api/disc'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'

  export default {
    data() {
      return {
        playList: {},
        playListUrl: []
      }
    },
    created() {
      this._getDiscList()
    },
    computed: {
      ...mapGetters([
        'disc',
        'mid'
      ])
    },
    methods: {
      _getDiscList() {
        if (!this.mid) {
          this.$router.push('/music/index')
          return
        }
        getDiscList(this.mid).then(res => {
          if (res.code === ERR_OK) {
            this.playList = res.cdlist[0]
            console.log(this.playList)
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.playListUrl = songs
            })
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

      _paddListen(number) {
        return (number / 10000).toFixed(1) + '万'
      },

    }

  }
</script>

<style lang="stylus" scoped>

  .disc-wrapper
    width 1200px
    margin 0 auto
    min-height: 100px
    .singerWrapper
      display flex
      padding 40px 0 35px 0
      .logo {
        width 250px
        height 250px
        img {
          width 100%
          vertical-align top
        }
      }
      .singerItem{
        padding-left 40px
        .dissname{
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
            border:1px solid #c9c9c9
            padding 10px 30px
            margin 20px 0
            font-size 15px
            color: #333
            border-radius 2px
            cursor pointer
            &:hover{
              background #EDEDED
            }
          }
          .active{
            background #31c27c
            color: #fff
            border-color #31c27c
            &:hover{
              background #2CAF6F
            }
          }

        }

      }


</style>
