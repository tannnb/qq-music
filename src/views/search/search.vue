<template>
  <div class="search-wrapper">

    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="searchFn">
        <input class="oInput" @keyup.enter="handleSearchBtn" type="text" v-model="searchInputText"><i class="icon-search" @click="handleSearchBtn"></i>
      </div>
      <div class="hotSearch"> 热门搜索:
        <a v-for="(items,index) in hotKey"
           @click="handleSelectHotKey(items)"
           :key="items.n">{{items.k}}</a>
      </div>
    </div>

    <div class="search-Container">
      <div class="search-main">

        <!-- 专辑类型 -->
        <div class="song-type" v-if="zhida&&zhida.type !== null">
          <div class="avatar" v-if="zhida.zhida_album">
            <img :src="zhida.zhida_album.albumPic" :alt="zhida.zhida_album.albumname_hilight">
          </div>
          <div class="songer-info"  v-if="zhida.zhida_album">
            <span class="albumName">{{zhida.zhida_album.albumName}}</span>
            <span class="singerName">{{zhida.zhida_album.singerName}}</span>
            <span class="publicTime">发行时间:{{zhida.zhida_album.publicTime}}</span>
            <div class="play">
              <i class="icon-play" @click="handlePlayAll">播放专辑</i>
            </div>
          </div>
        </div>

        <!-- 歌手类型-->
        <div class="songer-type" v-if="zhida&&zhida.type !== null">
          <div class="avatar" v-if="zhida.zhida_singer">
            <img :src="zhida.zhida_singer.singerPic" :alt="zhida.zhida_singer.singername_hilight">
          </div>
          <div class="songer-info"  v-if="zhida.zhida_singer">
            <span class="singerName">{{zhida.zhida_singer.singerName}}</span>
            <span class="singerName">单曲:{{zhida.zhida_singer.songNum}}</span>
            <span class="singerName">专辑:{{zhida.zhida_singer.albumNum}}</span>
            <span class="singerName">MV:{{zhida.zhida_singer.mvNum}}</span>
            <div class="play">
              <i class="icon-play"  @click="handlePlayAll">播放全部</i>
            </div>
          </div>
        </div>

        <div>
          <List-view
            v-if="songs.length !== '' "
            :song="songs"
            @handlePlayer="handlePlayer"
            @appendPlayer="appendPlayer"
          ></List-view>
        </div>


      </div>
    </div>

    <vue-progress-bar></vue-progress-bar>
    <confirm ref="confirm"
             :text="defaultText"
             confirmBtnText="确定"></confirm>
  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  import {gethotkey} from "../../api/recommend";
  import {clientSearch} from "../../api/search";
  import Confirm from '../../components/confirm/confirm'
  import ListView from '../../components/list-view/list-view'
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../api/search";
  import {processSongsUrl, isValidMusic} from "../../api/songList";

  export default {
    data(){
      return {
        hotKey:'',
        searchInputText:'',
        searchObjArr:[],
        zhida:{},
        songs:[],
        defaultText:'请输入要搜索的歌手名称或者歌曲名称'
      }
    },
    created() {
      this.$Progress.start()
      this._gethotkey()
      if(this.$route.query.key.k){
        this.searchInputText = this.$route.query.key.k
      }else{
        this.searchInputText = this.searchHistory[0].k
      }
    },
    components:{
      Confirm,
      ListView
    },
    computed: {
      ...mapGetters(['searchHistory']),
    },
    methods:{
      ...mapActions([
        'selectPlay',
        'saveSearcHistory'
      ]),
      _gethotkey() {
        gethotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = this._normal(res.data.hotkey)
          }
          this.$Progress.finish()
          this._clientSearch()
        })
      },

      _normal(item) {
        return item.slice(0, 5)
      },

      _clientSearch(){
        clientSearch(this.searchInputText).then(res => {
          let ret = res.data.trim()
          const Reg = /^\w+\(({.+})\)$/
          const matches = ret.match(Reg)
          const ObjArr = JSON.parse(matches[1])
          if (ObjArr.code === ERR_OK) {
            this.searchObjArr = ObjArr.data
            this.zhida = ObjArr.data.zhida

            processSongsUrl(this._normalizeSongs(this.searchObjArr.song.list)).then((songs) => {
              this.songs = songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
              this.$Progress.finish()
            }).catch(err => {
              this.$Progress.finish()
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.mid.length !== 0) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },

      // 热门
      handleSelectHotKey(items){
        this.searchInputText = items.k
        this._clientSearch()
      },

      // 搜索按钮
      handleSearchBtn(){
        let save = {
          k:this.searchInputText,
          n:0
        }
        this.saveSearcHistory(save)
        if(this.searchInputText.length === 0){
          this.$refs.confirm.show()
          return
        }
        this._clientSearch()
      },
      handlePlayer(items,index){
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      handlePlayAll(){
        if(this.songs.length === 0){
          this.defaultText='由于版权问题，无法播放该歌手歌曲，3秒之后为您切换上一次播放'
          this.$refs.confirm.show()
          setTimeout(() => {
            this.selectPlay({
              list: this.songs,
              index: 0
            })
            this.$refs.confirm.hide()
            return
          },3000)
        }
        this.selectPlay({
          list: this.songs,
          index: 0
        })
      },
      appendPlayer(items,index){
        console.log(items,index)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .search-wrapper {
    width 100%
    height 247px
  }

  .search-area {
    position: relative
    width 100%
    height 247px
    background url("./bg_search.jpg")
    background-size cover
    .searchFn {
      position absolute
      top: 85px
      left: 50%
      transform translateX(-50%)
      width 640px
      height: 50px
      border-radius 3px
      background white
      overflow hidden
      .oInput {
        border: none
        line-height 50px
        width 90%
        padding 0 10px
        font-size 15px
        color: #000
        outline none
      }
      .icon-search {
        position: absolute
        right: 0
        top: 50%
        transform translateY(-50%)
        font-size 24px
        padding 12px
        color: #989898
        vertical-align middle
        cursor pointer
        &:hover{
          color: #31c27c
        }
      }
    }
    .hotSearch {
      position absolute
      top: 155px
      left: 50%
      transform translateX(-50%)
      color: #fff
      a{
        display inline-block
        font-size 14px
        margin-left 16px
        color: #fff
        cursor pointer
        &:hover{
          text-decoration underline
        }
      }
    }
  }

  .search-Container{
    background: linear-gradient(#f3f3f3, #fff);
    .search-main{
      width 1200px
      padding-top 20px
      margin 0 auto
    }
  }

  .search-main {
    .song-type {
      display flex
      padding-bottom 10px
      .avatar {
        flex 0 0 120
        width 120
        img {
          width 96px
          vertical-align top
        }
      }
      .songer-info{
        flex 1
        padding-left 20px
        padding-top 12px
        .albumName{
          max-width: 200px;
          overflow: hidden;
          font-size 16px
          text-overflow: ellipsis;
        }
        .singerName{
          padding 0 20px
          font-size: 14px;
          color: #999;
        }
        .publicTime{
          font-size: 14px;
          color: #999;
        }
        .play{
          padding-top 20px
          i{
            display inline-block
            color: #fff
            background: #2caf6f
            border-radius: 2px;
            font-size: 15px;
            margin-right: 6px;
            padding: 0 23px;
            height: 38px;
            line-height: 38px;
            white-space: nowrap;
            box-sizing: border-box;
            overflow: hidden;
            cursor pointer
            &:hover{
              background: #299154
            }
          }

        }
      }
    }
    .songer-type {
      display flex
      padding-bottom 10px
      .avatar{
        flex 0 0 100
        width 100px
        border-radius 50%
        overflow hidden
        img{
          width 100%
          vertical-align top
        }
      }
      .songer-info{
        flex 1
        padding-left 20px
        padding-top 12px
        .singerName{
          margin-right: 20px;
        }
        .play{
          padding-top 20px
          i{
            display inline-block
            color: #fff
            background: #2caf6f
            border-radius: 2px;
            font-size: 15px;
            margin-right: 6px;
            padding: 0 23px;
            height: 38px;
            line-height: 38px;
            white-space: nowrap;
            box-sizing: border-box;
            overflow: hidden;
            cursor pointer
            &:hover{
              background: #299154
            }
          }

        }
      }
    }
  }

</style>
