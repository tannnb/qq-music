<template>
  <div>
    <!-- 歌单推荐 -->
    <recom-play-list v-if="recomPlaylistData" :recomPlaylistData="recomPlaylistData" @handleSelectRecomPlay="handleSelectRecomPlay"/>

    <!-- 新歌首发 -->
    <New-song v-if="newSongData" :newSongData="newSongData" @handleNewSong="handleNewSong" />

    <!-- 轮播图 -->
    <Slider v-if="focus" :focus="focus"></Slider>

    <!-- 新碟首发 -->
    <new-album v-if="newAlbum" :newAlbum="newAlbum" @handleNewAblum="handleNewAblum"></new-album>

    <!-- 排行榜 -->
    <top-list v-if="toplist"  :toplist="toplist"></top-list>


    <Loading v-if="!recomPlaylistData"></Loading>

  </div>

</template>

<script>
  import {mapActions,mapGetters} from 'vuex'
  import {ERR_OK} from "../../api/config";
  import {musicu} from '../../api/recommend'
  import recomPlayList from './recomPlayList'
  import NewSong from './newSong'
  import Slider from './slider'
  import newAlbum from './newAlbum'
  import topList from './toplist'
  import Loading from '../../components/loading/loading'
  import {getDiscList,getNewAlbumSong} from '../../api/disc'
  import {processSongsUrl, isValidMusic, createSong} from '../../api/songList'


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
      topList,
      Loading
    },
    created() {
      this._musicu()
    },
    computed:{
      ...mapGetters(['songs'])
    },
    methods: {
      ...mapActions([
        'saveDiscInfo',
        'saveSingID',
        'selectPlay'
      ]),
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
        this.$router.push({
          path:`/music/index/${item.id}`
        })
        // 保存歌曲信息
        this.saveDiscInfo(item)
        this.saveSingID(item.id)
      },

      // 新歌首发
      handleNewSong(item) {
       /* this.$router.push({
          path:`/music/index/${item.album_mid}`
        })
        this.saveDiscInfo(item)
        this.saveSingID(item.album_mid)*/
      },

      // 新碟首发
      handleNewAblum(song){
        getNewAlbumSong(song.album_mid).then(res => {
        /*  if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              //  排除没有url的歌曲
              this.songs =  songs.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
              this.selectPlay({
                list: this.songs,
                index: 0
              })
            })
          }*/
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

      handleTopList(){}

    }
  }
</script>

<style lang="stylus" scoped>




</style>
