<template>
  <div class="rankWrapper">
    <div class="rank-main">

      <div class="slider-wrapper">
        <div class="slider">
          <ul @click="handleSlider(items)"
              class="slider-items"
              v-for="(items,index) in listOpt"
              :key="items.GroupID">
            <span class="title">{{items.GroupName}}</span>
            <li class="item"
                v-for="(item,index) in items.List"
                :class="currentIndex === item.topID? 'active':''  "
                @click="handleSelectSlider(item)"
                :key="item.topID"> {{item.ListName}}
            </li>
          </ul>
        </div>
      </div>

      <div class="rankContent">
        <div class="content-Header">
          <strong class="tags">{{ListName}}</strong>
          <span class="time">{{showtime}}</span>
        </div>
        <div class="funBtn" v-if="songTable">
          <div class="funBtn-Btn"
               :class="songs && songs.length === 0? 'notSong':'active'"
               @click="handlePlayAll">
            <i class="icon-play"></i><span>播放全部</span>
          </div>
          <div class="funBtn-Btn">
            <i class="icon-pinglun"></i><span>全部评论({{songTable.comment_num}})</span>
          </div>
        </div>
        <ul class="content-songList">
          <li v-for="(items,index) in songs"
              class="songList-Item"
              :key="items.id">
            <div class="ranking">
              <span :class="getRankCls(song_begin,index)">{{getRankText(song_begin,index)}}</span>
            </div>
            <div class="avatar"><img :src="items.image" alt="" :title="items.name"></div>
            <div class="name">
              <div class="nameInfo">
                <span>{{items.name}}</span>
                <span class="isonly" v-show="items.isonly === 1">独家</span>
              </div>
              <div class="player">
                <span class="icon-play" @click="handleSelectSong(index)"></span>
              </div>
            </div>
            <div class="singer">{{items.singer}}</div>
            <div class="duration">{{items.duration | formatTimes}}</div>
          </li>
        </ul>
        <div class="no-songlist" v-if="songs.length === 0">暂无该排行信息 o(╥﹏╥)o</div>
        <div class="page-wrapper">
          <Pagination v-if="allpage" @pagetions="pagetions" :allpage="allpage"></Pagination>
        </div>
      </div>
    </div>

    <vue-progress-bar></vue-progress-bar>
    <confirm ref="confirm" text="暂时没有找到歌曲呢o(╥﹏╥)o" confirmBtnText="确定"></confirm>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {toplistOpt, toplistCp} from '../../api/rank'
  import {format} from "../../utils/tool";
  import {processSongsUrl, createSong} from "../../api/songList";
  import Confirm from '../../components/confirm/confirm'
  import Pagination from '../singer/pagination'
  import {ERR_OK} from "../../api/config"
  import {LoadingMixin} from "../../utils/mixin"


  export default {
    mixins: [LoadingMixin],
    data() {
      return {
        song_begin: 0,
        allpage: null,
        listOpt: [],
        currentIndex: 4,
        ListName: '',
        showtime: '',
        update_key: '',
        topID: '',
        songType: '',
        songTable: null,
        songs: [],
        miniLoadingFlag: false
      }
    },
    filters: {
      formatTimes(times) {
        return format(times)
      }
    },
    components: {
      Confirm,
      Pagination
    },
    created() {
      this.getToplistCp()
    },
    mounted() {

    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENTINDEX'
      }),

      async getToplistCp() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('排行榜加载中，请稍后...')
        try {
          // 获取左侧排行榜信息
          const response = await this._toplistOpt()
          this.$Progress.finish()
          this.listOpt = response
          const child = response[0].List[0]
          this.songType = response[0].Type
          // 设置默认第一个选中
          this.update_key = child.update_key
          this.topID = child.topID
          this.ListName = child.ListName
          this.showtime = child.showtime

          const listCp = await toplistCp(this.update_key, this.topID, this.songType, this.song_begin)
          if (listCp.data.code === ERR_OK) {
            this.songlist = listCp.data.songlist
            this.songTable = listCp.data
            this.song_begin = this.songTable.song_begin
            this.allpage = listCp.data.total_song_num
            this.getSong(this.songlist)
          }
        } catch (e) {
          this.$Progress.finish()
          this.showLoading.hide()
        }
      },

      _toplistOpt() {
        return new Promise((resolve, reject) => {
          toplistOpt().then(res => {
            let ret = res.data.trim()
            var result = ret.replace(/\n/g, "");
            const matches = result.replace(/^\w+\(/, '')
            const str = matches.replace(/\)$/, '')
            const listOpt = JSON.parse(str)
            resolve(listOpt)
          })
            .catch(err => {
              reject(err)
            })
        })
      },

      async getSong(song) {
        try {
          const response = await processSongsUrl(this._normalizeSongs(song))
          this.showLoading.hide()
          this.songs = response.filter((currentSong) => {
            return currentSong.url.length !== 0
          })
        } catch (e) {
          this.showLoading.hide()
          if (this.songs.length === 0) {
            this.$refs.confirm.show()
          }
        }
      },

      getRankCls(song_begin, index) {
        if (song_begin === 0) {
          if (index <= 2) {
            return `icon icon${index}`
          } else {
            return ''
          }
        }
        if (song_begin > 0) {
          return ''
        }

      },
      getRankText(song_begin, index) {
        if (song_begin === 0) {
          if (index > 2) {
            return `${song_begin + 1 + index}`
          }
        }
        if (song_begin > 0) {
          return `${song_begin + 1 + index}`
        }
      },

      handleSlider(item) {
        this.songType = item.Type
      },

      // 切换榜单
      async handleSelectSlider(item) {
        this.showToast = this.CreateToast()
        // 切换榜单，从第一页开始
        this.song_begin = 0
        this.miniLoadingFlag = true
        this.currentIndex = item.topID
        this.ListName = item.ListName
        this.showtime = item.showtime
        this.update_key = item.update_key
        this.topID = item.topID
        this.songType = this.songType

        try {
          const response = await toplistCp(this.update_key, this.topID, this.songType)
          // 若是没有歌曲
          if (response.data.code === ERR_OK) {
            this.showToast.hide()
            this.songlist = response.data.songlist
            this.songTable = response.data
            this.getSong(this.songlist)
            this.allpage = response.data.total_song_num
            setTimeout(() => {
              document.documentElement.scrollTop = document.body.scrollTop = 0;
            }, 200)
          }
          if (response.data === ' ') {
            this.showToast.hide()
            this.$refs.confirm.show()
          }
        } catch (e) {
          this.showToast.hide()
        }
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.data.songid && musicData.data.albummid) {
            ret.push(createSong(musicData.data))
          }
        })
        return ret
      },

      // 播放全部
      handlePlayAll() {
        if (this.songs.length === 0) {
          this.$refs.confirm.show()
          return
        }
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },

      handleSelectSong(index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },

      // 分页
      async pagetions(index) {
        this.song_begin = (index - 1) * 30
        this.showToast = this.CreateToast()
        try {
          const response =  await toplistCp(this.update_key, this.topID, this.songType, this.song_begin)
          if(response.data.code === ERR_OK){
            this.showToast.hide()
            this.songlist = response.data.songlist
            this.songTable = response.data
            this.song_begin = this.songTable.song_begin
            this.allpage = response.data.total_song_num
            this.getSong(this.songlist)
            setTimeout(() => {
              document.documentElement.scrollTop = document.body.scrollTop = 0;
            }, 200)
          }
        }catch (e) {
          this.showToast.hide()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .rankWrapper {
    padding-top 35px
    background: linear-gradient(#f3f3f3, #fff);
    .rank-main {
      display flex
      width 1200px
      margin 0 auto
      .slider-wrapper {
        flex 0 0 150
        width 150px
      }
      .slider {
        border: 1px solid rgba(153, 153, 153, .2)
        .slider-items {
          .title {
            display block
            line-height: 60px;
            font-size: 20px;
            font-weight: 400;
            font-size 15px
            text-align center
            border-bottom: 1px solid #ebebeb;
            margin: 0 17px 10px;
          }
          .item {
            display: block;
            text-align center
            line-height: 22px;
            padding: 8px 17px;
            font-size 14px
            cursor pointer
            &:hover {
              color: #31c27c
            }
            &.active {
              color: #fff
              background: #31c27c
            }
          }
        }
      }
      .rankContent {
        position: relative
        flex 1
        padding-left 30px
        .content-Header {
          margin-top: 20px;
          .tags {
            font-weight: 400;
            font-size: 24px;
          }
          .time {
            font-size: 14px;
            padding-left 10px
            color: #333333
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
        .content-songList {
          background white
          .songList-Item {
            display flex
            align-items center
            padding 10px 0
            border-bottom 1px solid #f2f2f2
            .ranking {
              flex 0 0 80
              width 80px
              text-align center
              color: #636363
              .icon {
                display: inline-block;
                width: 25px;
                height: 24px;
                background-size: 25px 24px;
                &.icon0 {
                  background url("./first.png")
                  background-size cover
                }
                &.icon1 {
                  background url("./second.png")
                  background-size cover
                }
                &.icon2 {
                  background url("./third.png")
                  background-size cover
                }
              }
            }
            .avatar {
              width 60px
              padding-right 10px
              cursor pointer
              img {
                width 100%
                vertical-align top
              }
            }
            .name {
              flex 1
              display flex
              align-items center
              font-size 15px
              color: #373737
              cursor pointer
              &:hover {
                color: #31c27c
              }
              .nameInfo {
                flex 1
                .isonly {
                  color: #31c27c
                  padding 2px 6px
                  margin-left 6px
                  font-size 13px
                  border: 1px solid #31c27c
                  border-radius 4px
                }
              }
              .player {
                flex 0 0 100
                width 100px
                span {
                  display none
                  font-size 44px
                  cursor pointer
                  color: #b1b1b1
                  &:hover {
                    color: #31c27c
                  }
                }
              }
            }
            .singer {
              flex 0 0 170
              width 170px
              margin-right 20px
              font-size 14px
              color: #171717
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            }
            .duration {
              flex 0 0 100
              width 100px
              font-size 14px
              color: #999
            }
            &:hover {
              .name {
                .icon-play {
                  display block
                }
              }
            }
          }
        }

        .page-wrapper {
          padding-top 20px
          text-align center
        }
        .miniloading-wrapper {
          position: absolute
          top: 100px
          left 0
          width 100%
          min-height 300px
          z-index 10
        }

        .no-songlist {
          font-size 16px
          text-align center
          padding 100px 0
        }

      }

    }
  }

</style>
