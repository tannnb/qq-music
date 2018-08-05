<template>
  <div class="sort_desc">
    <div class="sort_singerInfo" v-if="cdlist && cdlist.length !== 0">
      <div class="avatar"><img :src="cdlist.logo"></div>
      <div class="singerInfo">
        <h2 class="songName">{{cdlist.dissname}}</h2>
        <div class="simgerName"><i class="icon-user"></i>{{cdlist.nickname}}</div>
        <ul class="singtag">
          <li>标签：{{filterSinger(cdlist.tags)}}</li>
          <li>播放量：{{cdlist.visitnum | listen}}</li>
        </ul>
        <div class="funBtn">
          <span class="active" :class=" songs.length === 0? 'notSong':'' " @click="handlePlayAll"> <i
            class="icon-play"></i> 播放全部</span>
          <span><i class="icon-collect"></i>收藏</span>
          <span><i class="icon-pinglun"></i>评论</span>
          <span><i class="icon-more"></i>更多</span>
        </div>
      </div>
    </div>
    <div class="sort_singerContent">
      <div class="sort_singerlist">
        <List-view
          v-if="songs.length !== '' "
          :song="songs"
          @handlePlayer="handlePlayer"
          @appendPlayer="appendPlayer"
        ></List-view>
        <p class="notSongUrl" v-if="notSongUrl">暂时没有找到歌曲,o(╥﹏╥)o</p>
      </div>
      <div class="introduction">
        <div class="name">简介</div>
        <div class="desc" v-html="cdlist.desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getSortDesc} from "../../api/sort";
  import {processSongsUrl, isValidMusic, createSong} from "../../api/songList";
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import ListView from '../../components/list-view/list-view'

  export default {
    name: "sort_desc",
    data() {
      return {
        cdlist: [],
        songs: [],
        notSongUrl: false
      }
    },
    components: {
      ListView
    },
    computed: {
      ...mapGetters(['mid', 'initDisc'])
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      }
    },
    created() {
      this._getSortDesc()
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      _getSortDesc() {
        if (!this.mid) {
          this.$router.push('/music/album')
          return
        }
        getSortDesc(this.mid).then(res => {
          if (res.subcode === ERR_OK) {
            this.notSongUrl = false
            this.cdlist = res.cdlist[0]
            console.log(this.cdlist)
            processSongsUrl(this._normalizeSongs(this.cdlist.songlist)).then(songs => {
              this.songs = songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })

            }).catch(err => {
              this.notSongUrl = true
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
      handlePlayAll() {
        if (this.notSongUrl) {
          alert('暂无歌曲')
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
      appendPlayer() {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .sort_desc {
    padding-top 40px
    background: linear-gradient(#f3f3f3, #fff);
    .sort_singerInfo {
      display flex
      width 1200px
      margin 0 auto
      padding-bottom 40px
      .avatar {
        flex 0 0 250
        width 250px
        img {
          width 100%
          vertical-align top
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
          li {
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
    .sort_singerContent {
      display flex
      width 1200px
      margin 0 auto
      .sort_singerlist {
        width 860px
        .notSongUrl {
          margin 60px auto 30px auto
          text-align center
          color: #999
        }
      }

      .introduction {
        flex 0 0 300
        width 300px
        padding-left 30px
        .name {
          font-size: 15px
          font-weight: 400
          line-height: 46px
        }
        .desc {

          font-size: 14px
          line-height: 22px
          overflow: hidden
        }
      }

    }
  }
</style>
