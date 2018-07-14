<template>
  <div class="disc-wrapper">
    <div class="singerWrapper">
      <div class="logo"><img :src="playList.logo" alt=""></div>
      <div class="singerItem">
        <div class="dissname">{{playList.dissname}}</div>
        <div class="tags"><i class="icon-user"></i> {{playList.nickname}}</div>
        <div class="tags" v-if="playList.tags">标签：{{playList.tags[0].name}}</div>
        <div class="tags">播放量：{{_paddListen(playList.visitnum)}}</div>
        <div class="tags">收藏量：</div>
        <div class="funBtn">
          <span class="active"> <i class="icon-play"></i> 播放全部</span>
          <span><i class="icon-collect"></i>收藏</span>
          <span><i class="icon-pinglun"></i>评论</span>
          <span><i class="icon-more"></i>更多</span>
        </div>
      </div>
    </div>
    <div class="list-wrapper">
      <List-view
        v-if="songs.length !== '' "
        :song="songs"
        @handlePlayer="handlePlayer"
        @appendPlayer="appendPlayer"
      ></List-view>
      <div class="introduction">
        <div class="name">简介</div>
        <div class="desc">{{playList.desc}}</div>
      </div>
    </div>
    <div class="list-wrapper" style="width: 860px">
      <review-list v-if="commentlist" :commentlist="commentlist" :commenttotal="commenttotal"></review-list>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import {ERR_OK} from "../../api/config";
  import {getDiscList, review} from '../../api/disc'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'

  export default {
    data() {
      return {
        playList: {},
        songs: [],
        commentlist: null,
        commenttotal: ''
      }
    },
    created() {
      this._getDiscList()
    },
    components: {
      ListView,
      reviewList
    },
    computed: {
      ...mapGetters([
        'disc',
        'mid'
      ])
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),

      handlePlayer(items, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      appendPlayer(items) {
      },

      _getDiscList() {
        if (!this.mid) {
          this.$router.push('/music/index')
          return
        }
        getDiscList(this.mid).then(res => {
          if (res.code === ERR_OK) {
            this.playList = res.cdlist[0]
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              //  排除没有url的歌曲
              this.songs =  songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
            })
          }
        })
        review(this.mid).then(res => {
          if (res.data.code === ERR_OK) {
            this.commentlist = res.data.comment.commentlist
            this.commenttotal = res.data.comment.commenttotal
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
      }

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
          }

        }

      }

    .list-wrapper
      display flex
      .introduction
        padding-left 30px
        .name
          font-size: 15px
          font-weight: 400
          line-height: 46px
        .desc
          max-height: 88px
          font-size: 14px
          line-height: 22px
          overflow: hidden
</style>
