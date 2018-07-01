<template>
  <div>
    <Music-header @handleSelect="handleSelect" :currentIndex="currentIndex"></Music-header>
    <Music-nav></Music-nav>
    <div class="container">
      <MusicSubheader :datas="recomPlaylistTitle"
                      :currentIndex="recomCurrentIndex"
                      @handleSelectItem="handleSelectItem"/>
      <div class="swiperWrapper">
        <div class="swiperWrapper-outer">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(items,index) in recomPlaylist" :key="index">
              <div class="playlist_item_box">
                <div class="coverImg"><img :src="items.image" alt=""></div>
                <p class="title">{{items.title}}</p>
                <p class="listen_num">播放量:{{items.duration}}</p>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </div>
    </div>

  </div>
</template>

<script>
  import MusicHeader from '../../components/music-header/music-header'
  import MusicNav from '../../components/music-nav/music-nav'
  import MusicSubheader from '../../components/music-subHeader/music-subHeader'
  import {ERR_OK} from "../../api/config";
  import {config} from './config'
  import {Createrecommend} from '../../utils/util'
  import {musicu, recommend} from '../../api/recommend'

  export default {
    name: "index",
    data() {
      return {
        currentIndex: 0,
        recomPlaylist: [],
        recomPlaylistTitle: config.recommendPlaylistTitle,
        recomCurrentIndex: 0,
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          simulateTouch: false,
          slidesPerView: 5,
          slidesPerGroup: 5,
          observer: true,
          observeParents: true
        }
      }
    },
    components: {
      MusicHeader,
      MusicNav,
      MusicSubheader
    },
    created() {
      this._musicu()
    },
    methods: {
      handleSelect(items) {
        this.currentIndex = Number(items.id)
      },
      _musicu() {
        musicu().then(res => {
          if (res.recomPlaylist.code === ERR_OK) {
            this.recomPlaylist = this._normalizeSongs(res.recomPlaylist.data.v_hot)
          }
        })
      },

      _normalizeSongs(list, flag) {
        let ret = []
        list.forEach((musicData) => {
          // 初始化为你推荐
          if (!flag && musicData.content_id) {
            ret.push(new Createrecommend({...musicData}))
          }

          if (flag && musicData.tid) {
            ret.push(new Createrecommend({
              content_id: musicData.tid,
              mid: musicData.mid ? musicData.mid : '',
              singerid: musicData.singerid ? musicData.singerid : '',
              title: musicData.title,
              cover: musicData.cover_url_big,
              listen_num: musicData.access_num
            }))
          }
        })
        return ret
      },

      handleSelectItem(index, items) {
        this.recomCurrentIndex = index
        let isFirstIndex = items.index === 0 ? '' : items.id
        recommend(isFirstIndex).then(res => {
          if (res.code === ERR_OK) {
            if (!isFirstIndex) {
              this.recomPlaylist = this._normalizeSongs(res.recomPlaylist.data.v_hot)
              return
            }
            this.recomPlaylist = this._normalizeSongs(res.playlist.data.v_playlist, true)
          }
        })
      }

    }
  }
</script>

<style lang="stylus" scoped>


  .swiper-pagination {
    >>> .swiper-pagination-bullet-active {
      background rgba(0, 0, 0, 0.5)
    }
  }

  .swiper-container-horizontal >>> .swiper-pagination-bullets {
    bottom 0px
  }

    .container{
      background-color: #f3f3f3
      padding-bottom 20px
    }

  .swiperWrapper {
    position: relative
    >>>.swiper-wrapper{
      padding-bottom 20px
    }
    .swiper-button-prev {
      position: absolute
      top 140px
      left: 10px
    }
    .swiper-button-next {
      position: absolute
      top 140px
      right: 10px
    }
    .swiperWrapper-outer {
      width 1200px
      margin 0 auto
    }
    .playlist_item_box {
      width 224px
      margin-right 20px
      .coverImg {
        width 100%
        overflow hidden
        cursor pointer
        &:hover {
          img {
            transform scale(1.05)
          }
        }
        img {
          transition all .4s
          width 100%
          vertical-align top
        }
      }

      .title {
        padding 10px 0 8px 0
        font-size 14px
        color: #000
        cursor pointer
        &:hover {
          color: #31c27c
        }
      }
      .listen_num {
        font-size 14px
        color: #999
      }
    }
  }


</style>
