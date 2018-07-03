<template>
  <div>
    <!-- 歌单推荐 -->
    <recom-play-list v-if="recomPlaylistData" :recomPlaylistData="recomPlaylistData" @handleSelectRecomPlay="handleSelectRecomPlay"/>

    <!-- 新歌首发 -->
    <New-song v-if="newSongData" :newSongData="newSongData" @handleNewSong="handleNewSong" />

    <!-- 轮播图 -->
    <Slider v-if="focus" :focus="focus"></Slider>

  </div>

</template>

<script>
  import {ERR_OK} from "../../api/config";
  import {musicu} from '../../api/recommend'
  import recomPlayList from './recomPlayList'
  import NewSong from './newSong'
  import Slider from './slider'


  export default {
    data() {
      return {
        recomPlaylistData:null,
        newSongData: null,
        focus: null
      }
    },
    components: {
      recomPlayList,
      NewSong,
      Slider
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
            this.focus = res.focus.data.content
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
      }

    }
  }
</script>

<style lang="stylus" scoped>




</style>
