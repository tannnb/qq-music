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
          <div class="funBtn-Btn"
               :class="songs && songs.length === 0? 'notSong':'active'"
               @click="handlePlayAll">
            <i class="icon-play"></i><span>播放全部</span>
          </div>
          <div class="funBtn-Btn" @click="handleClickComment">
            <i class="icon-pinglun"></i><span>评论({{commenttotal}})</span>
          </div>
        </div>
      </div>
    </div>

    <div class="list-wrapper">
      <div class="listContent">
        <List-view
          v-if="songs.length !== '' "
          :song="songs"
          @handlePlayer="handlePlayer"
          @appendPlayer="handleAppendPlayer"
        ></List-view>
        <p class="noSong" v-if="songs.length === 0">暂时没有找到歌曲，抱歉！</p>
      </div>
      <div class="introduction">
        <div class="name">简介</div>
        <div class="desc" v-html="playList.desc"></div>
      </div>
    </div>

    <div class="reviewWrapper">
      <review-list ref="reviewList"
                   v-if="commentlist"
                   :commentlist="commentlist"
                   :commenttotal="commenttotal">
      </review-list>
    </div>

    <vue-progress-bar></vue-progress-bar>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import ListView from '../../components/list-view/list-view'
  import reviewList from '../../components/review-list/review-list'
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import {getDiscList, review} from '../../api/disc'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'
  import {LoadingMixin} from "../../utils/mixin";

  export default {
    mixins: [LoadingMixin],
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
        'selectPlay',
        'insertSong'
      ]),

      copyrightIssue(message) {
        var vm = this
        this.CreateDialog({
          message: message ? message : '抱歉，因版权限制,暂无法获取！',
          confirmBtnText: '立即返回',
          cancelBtn: false,
          showClose: true,
          confirmBtn() {
            vm.$router.push('/music/index')
          }
        })
      },

      handlePlayer(items, index) {
        if (this.songs.length === 0) {
          this.copyrightIssue()
          return
        }
        this.selectPlay({
          list: this.songs,
          index: index
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
      handleAppendPlayer(items) {
        this.insertSong(items)
      },
      async _getDiscList() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('加载中，请稍后...')
        if (!this.mid) {
          this.showLoading.hide()
          this.$Progress.finish()
          this.$router.push('/music/index')
          return
        }

        // 获取歌曲列表
        try {
          const response = await getDiscList(this.mid)
          if (response.code === ERR_OK) {
            this.playList = response.cdlist[0]

            try {
              // 获取播放地址
              const result = await processSongsUrl(this._normalizeSongs(response.cdlist[0].songlist))
              //  排除没有url的歌曲
              this.songs = result.filter(currentSong => {
                return currentSong.url.length !== 0
              })
              this.showLoading.hide()
              this.$Progress.finish()
            }catch (e) {
              this.showLoading.hide()
              this.$Progress.finish()
              this.copyrightIssue()
            }

            // 获取评论
            review(this.mid).then(res => {
              if (res.data.code === ERR_OK) {
                this.commentlist = res.data.comment.commentlist
                this.commenttotal = res.data.comment.commenttotal
              }
            })

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

      filterSinger(singer) {
        let ret = []
        if (!singer) {
          return ''
        }
        singer.forEach((s) => {
          ret.push(s.name)
        })
        return ret.join(' ')
      },

      handleClickComment() {
        const Top = this.$refs.reviewList.$el.offsetTop
        document.documentElement.scrollTop = document.body.scroll = Top
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
        padding-left 50px
        .dissname {
          padding-top 20px
          padding-bottom 10px
          font-size 32px
        }
        .tags {
          font-size 14px
          padding 6px 0
          .icon-user {
            color #b7b7b7
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
    .list-wrapper
      width 1200px
      margin 0 auto
      display flex
      .listContent {
        width 860px
        .noSong {
          margin 100px auto
        }
      }
      .introduction
        flex 0 0 300
        width 300px
        padding 0 30px
        background #fff
        .name
          font-size: 16px
          font-weight: bold
          line-height: 46px
        .desc
          font-size: 14px
          line-height: 26px
          overflow: hidden
    .reviewWrapper
      width 1200px
      margin 0 auto
</style>
