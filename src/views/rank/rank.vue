<template>
  <div class="rankWrapper">
    <div class="rank-main">
      <div class="slider">
        <ul @click="handleSlider(items)" class="slider-items" clas v-for="(items,index) in listOpt"
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
      <div class="rankContent">

        <div class="content-Header"><strong class="tags">{{ListName}}</strong> <span class="time">{{showtime}}</span></div>
        <div class="content-fun">
          <span class="active"
                :class=" songs.length === 0? 'notSong':'' "
                @click="handlePlayAll"
          > <i class="icon-play"></i> 播放全部</span>
        </div>
        <div class="content-songTitle"></div>
        <ul class="content-songList">
          <li v-for="(items,index) in songs"
              class="songList-Item"
              :key="items.id">
            <div class="ranking">
              <span :class="getRankCls(index)">{{getRankText(index)}}</span>
            </div>
            <div class="avatar">
              <img :src="items.image" alt="">
            </div>
            <div class="name">{{items.name}}</div>
            <div class="singer">{{items.singer}}</div>
            <div class="duration">{{items.duration | formatTimes}}</div>
          </li>
        </ul>


      </div>
    </div>
    <Loading v-if="songs.length === 0"></Loading>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {toplistOpt, toplistCp} from '../../api/rank'
  import {format} from "../../utils/tool";
  import {processSongsUrl, isValidMusic, createSong} from "../../api/songList";
  import Loading from '../../components/loading/loading'
  import {ERR_OK} from "../../api/config";


  export default {
    name: "rank",
    data() {
      return {
        listOpt: [],
        currentIndex: 0,
        ListName:'',
        showtime:'',
        update_key: '',
        topID: '',
        songType: '',
        songs:[]
      }
    },
    filters:{
      formatTimes(times){
        return format(times)
      }
    },
    components: {
      Loading
    },
    created() {
      this._toplistOpt().then(res => {
        this.listOpt = res
        const child = res[0].List[0]
        this.songType = res[0].Type
        this.update_key = child.update_key
        this.topID = child.topID
        this.ListName = child.ListName
        this.showtime = child.showtime

        toplistCp( this.update_key, this.topID, this.songType).then(res => {
          if(res.data.code === ERR_OK){
            this.songlist = res.data.songlist
            this.getSong(this.songlist)
          }
        })

      })
    },
    mounted(){
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),

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

      getSong(song){
        processSongsUrl(this._normalizeSongs(song)).then((songs) => {
          this.songs = songs.filter((currentSong) => {
            return currentSong.url.length !== 0
          })
        }).catch(err => {
          this.notSongUrl = true
        })
      },

      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return ''
        }
      },
      getRankText(index) {
        if (index > 2) {
          return `${index + 1}`
        }
      },

      handleSlider(item) {
        this.songType = item.Type
      },
      handleSelectSlider(item) {
        console.log(item)
        this.currentIndex = item.topID
        this.ListName = item.ListName
        this.showtime = item.showtime
        this.update_key = item.update_key
        this.topID = item.topID
        this.songType = this.songType
        toplistCp( this.update_key, this.topID, this.songType).then(res => {
          if(res.data.code === ERR_OK){
            this.songlist = res.data.songlist
            this.getSong(this.songlist)
          }
        }).catch(err => {
          console.log(err)
        })
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
      handlePlayAll(){
        if (this.notSongUrl) {
          this.$refs.confirm.show()
          return
        }
        this.selectPlay({
          list: this.songs,
          index: 0
        })
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
      .slider {
        flex 0 0 150
        width 150px
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
        flex 1
        padding-left 30px
        .content-Header{
          margin-top: 20px;
          .tags{
            font-weight: 400;
            font-size: 24px;
          }
          .time{
            font-size: 14px;
            padding-left 10px
            color: #333333
          }
        }
        .content-fun{
          span {
            display inline-block
            border: 1px solid #31c27c
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
        .content-songTitle{}
        .content-songList{
          .songList-Item{
            display flex
            align-items center
            padding 10px 0
            &:nth-child(even){
              background rgba(0,0,0,.01)
            }
            .ranking{
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
                  background url("./first@3x.png")
                  background-size cover
                }
                &.icon1 {
                  background url("./second@3x.png")
                  background-size cover
                }
                &.icon2 {
                  background url("./third@3x.png")
                  background-size cover
                }
              }
            }
            .avatar{
              width 60px
              padding-right 10px
              img{
                width 100%
                vertical-align top
              }
            }
            .name{
              flex 1
              font-size 15px
              color: #373737
            }
            .singer{
              flex 0 0 170
              width 170px
              margin-right 20px
              font-size 14px
              color: #171717
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
            }
            .duration{
              flex 0 0 100
              width 100px
              font-size 14px
              color: #999
            }
          }
        }
      }
    }
  }

</style>
