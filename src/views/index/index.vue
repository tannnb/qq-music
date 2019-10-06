<template>
    <div>


        <!-- 轮播图 -->
        <Slider v-if="focus" @handleSelectSliderAd="handleSelectSliderAd" :focus="focus"/>


        <!-- 歌单推荐 -->
        <recom-play-list
                v-if="recomPlaylistData"
                :recomPlaylistData="recomPlaylistData"
                @handleSelectRecomPlay="handleSelectRecomPlay"/>

        <!-- 新歌首发 -->
        <!--  <New-song v-if="newSongData" :newSongData="newSongData" @handleNewSong="handleNewSong"/>-->


        <!-- 新碟首发 -->
        <!-- <new-album v-if="newAlbum" :newAlbum="newAlbum" @handleNewAblum="handleNewAblum"></new-album>-->

        <!-- 排行榜 -->
        <!--  <top-list v-if="toplist" :toplist="toplist"></top-list>-->

        <vue-progress-bar></vue-progress-bar>
    </div>

</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { ERR_OK } from '../../api/config'
  import { musicu } from '../../api/recommend'
  import recomPlayList from './recomPlayList'
  import NewSong from './newSong'
  import Slider from './slider'
  import newAlbum from './newAlbum'
  import topList from './toplist'
  import { getDiscList, getNewAlbumSong } from '../../api/disc'
  import { processSongsUrl, isValidMusic, createSong } from '../../api/songList'
  import { LoadingMixin } from '../../utils/mixin'

  export default {
    mixins: [LoadingMixin],
    data () {
      return {
        recomPlaylistData: null,
        newSongData: null,
        focus: null,
        newAlbum: null,
        toplist: null,
      }
    },
    components: {
      recomPlayList,
      NewSong,
      Slider,
      newAlbum,
      topList,
    },
    created () {
      this.$_getRecomPlayData()
    },
    methods: {
      ...mapActions([
        'saveDiscInfo',
        'saveSingID',
        'selectPlay',
      ]),
      async $_getRecomPlayData () {
        this.$Progress.start()
        try {
          const response = await musicu()
          if (response.code === ERR_OK) {
            this.$Progress.finish()
            this.recomPlaylistData = response.recomPlaylist.data.v_hot
            this.focus = response.focus.data.content
          }
        } catch (e) {
          this.$Progress.finish()
        }
      },

      onChange () {

      },

      // 歌单推荐
      handleSelectRecomPlay (item) {
        this.$router.push({
          path: `/music/index/${item.id}`,
        })
        // 保存歌曲信息
        this.saveDiscInfo(item)
        this.saveSingID(item.id)
      },

      // 精彩推荐
      handleSelectSliderAd (item) {
        this.$router.push({
          path: `/music/album/${item.mid}`,
        })
        // 保存歌曲信息
        this.saveDiscInfo(item)
        this.saveSingID(item.mid)
      },

      // 新歌首发
      handleNewSong (item) {
        /* this.$router.push({
             path:`/music/album/${item.album_mid}`
           })
           this.saveDiscInfo(item)
           this.saveSingID(item.album_mid) */
      },

      // 新碟首发
      handleNewAblum (song) {
        /* getNewAlbumSong(song.album_mid).then(res => {
               if (res.code === ERR_OK) {
                 processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {

                   this.songs =  songs.filter((currentSong) => {
                     return currentSong.url.length !== 0
                   })
                   this.selectPlay({
                     list: this.songs,
                     index: 0
                   })
                 })
               }
          }) */
      },

      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
    },
  }
</script>

