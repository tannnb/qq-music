<template>
  <div>
    <!-- 歌单推荐 -->
    <recom-play-list v-if="recomPlaylistData" :recomPlaylistData="recomPlaylistData" @handleSelectRecomPlay="handleSelectRecomPlay"/>

    <!-- 新歌首发 -->
    <New-song v-if="newSongData" :newSongData="newSongData" @handleNewSong="handleNewSong" />

    <!-- 轮播图 -->
    <Slider v-if="focus" :focus="focus"></Slider>

    <!-- 新碟首发 -->
    <new-album v-if="newAlbum" :newAlbum="newAlbum"></new-album>

    <!-- 排行榜 -->
    <top-list v-if="toplist"  :toplist="toplist"></top-list>

  </div>

</template>

<script>
  import {ERR_OK} from "../../api/config";
  import {musicu} from '../../api/recommend'
  import recomPlayList from './recomPlayList'
  import NewSong from './newSong'
  import Slider from './slider'
  import newAlbum from './newAlbum'
  import topList from './toplist'


  export default {
    data() {
      return {
        recomPlaylistData:null,
        newSongData: null,
        focus: null,
        newAlbum:null,
        toplist:null
      }
    },
    components: {
      recomPlayList,
      NewSong,
      Slider,
      newAlbum,
      topList
    },
    created() {
      this._musicu()
    },
    methods: {
      _musicu() {
        musicu().then(res => {
          if(res.code === ERR_OK){
            this.recomPlaylistData = res.recomPlaylist.data.v_hot;
            this.newSongData = res.new_song.data;
            this.focus = res.focus.data.content;
            this.newAlbum = res.new_album.data
            this.toplist = res.toplist.data
          }
        })
      },

      // 歌单推荐
      handleSelectRecomPlay(item){
        console.log(item)
      },

      // 新歌首发
      handleNewSong(item) {
        console.log(item)
      },

      handleTopList(){

      }

    }
  }
</script>

<style lang="stylus" scoped>




</style>
