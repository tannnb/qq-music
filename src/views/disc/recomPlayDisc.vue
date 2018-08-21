<template>
  <div class="disc-wrapper">
    <div class="singerWrapper" v-if="playList">
      <div class="logo"><img :src="playList.logo" alt=""></div>
      <div class="singerItem">
        <div class="dissname">{{playList.dissname}}</div>
        <div class="tags"><i class="icon-user"></i> {{playList.nickname}}</div>
        <div class="tags" v-if="playList.tags">标签：{{filterSinger(playList.tags)}}</div>
        <div class="tags" v-if="playList.visitnum">播放量：{{playList.visitnum | listen}}</div>
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
    <div class="list-wrapper">
      <div class="listContent">
        <List-view
          v-if="songs.length !== '' "
          :song="songs"
          @handlePlayer="handlePlayer"
          @appendPlayer="appendPlayer"
        ></List-view>
        <p class="noSong" v-if="songs.length === 0">暂时没有找到歌曲，抱歉！</p>
      </div>
      <div class="introduction">
        <div class="name">简介</div>
        <div class="desc" v-html="playList.desc"></div>
      </div>
    </div>
    <div class="reviewWrapper">
      <review-list v-if="commentlist" :commentlist="commentlist" :commenttotal="commenttotal"></review-list>
    </div>
    <vue-progress-bar></vue-progress-bar>
    <confirm ref="confirm"
             text="暂时没有找到歌曲，抱歉！"
             confirmBtnText="确定"></confirm>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import Confirm from '../../components/confirm/confirm'
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
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
      this.$Progress.start()
      this._getDiscList()
    },
    components: {
      ListView,
      reviewList,
      Confirm
    },
    computed: {
      ...mapGetters([
        'disc',
        'mid'
      ])
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      },
      filterSingers(singer) {
        return filterSinger(singer)
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),

      handlePlayer(items, index) {
        if(this.songs.length === 0){
          return
        }
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
              this.songs = songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
            })
            this.$Progress.finish()
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

      filterSinger(singer) {
        let ret = []
        if (!singer) {
          return ''
        }
        singer.forEach((s) => {
          ret.push(s.name)
        })
        return ret.join('/')
      }
    }

  }
</script>

<style lang="stylus" scoped>

  .disc-wrapper
    background: linear-gradient(#f3f3f3, #fff);
    .singerWrapper
      display flex
      width 1200px
      margin 0 auto
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
            &.notSong {
              border-color #848484
              user-select none
            }
          }

        }

      }

    .list-wrapper
      width 1200px
      margin 0 auto
      display flex
      .listContent {
        width 860px
        .noSong{
          margin 100px auto
        }
      }
      .introduction
        flex 0 0 300
        width 300px
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
    .reviewWrapper
      width 1200px
      margin 0 auto
</style>
