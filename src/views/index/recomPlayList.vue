<template>
  <div class="container">
    <MusicSubheader :datas="recomPlaylistTitle"
                    :currentIndex="recomCurrentIndex"
                    @handleSelectItem="handleSelectNavItem"/>
    <div class="swiperWrapper">
      <div class="swiperWrapper-outer">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(items,index) in recomPlaylist" :key="index">
            <div class="playlist_item_box" @click="handleSelectItem(items)">
              <div class="coverImg"><img :src="items.image" alt=""></div>
              <p class="title">{{items.title}}</p>
              <p class="listen_num">播放量:{{_paddListen(items.duration)}}</p>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="slider-prev" slot="button-prev"><span class="prev"></span></div>
      <div class="slider-next" slot="button-prev"><span class="next"></span></div>
    </div>
  </div>
</template>

<script>
  import {ERR_OK} from "../../api/config";
  import {config} from './config'
  import {Createrecommend} from '../../utils/util'
  import {recommend} from '../../api/recommend'
  import MusicSubheader from '../../components/music-subHeader/music-subHeader'


  export default {
    props: {
      recomPlaylistData: {
        type: Array,
        default: []
      }
    },
    components: {
      MusicSubheader,
    },
    data() {
      return {
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
            nextEl: '.slider-next',
            prevEl: '.slider-prev'
          },
          loop: true,
          simulateTouch: false,
          slidesPerView: 5,
          slidesPerGroup: 5,
          observer: true,
          observeParents: true
        }
      }
    },
    created() {
      this.recomPlaylist = this._normalizeSongs(this.recomPlaylistData)
    },
    methods: {
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

      _paddListen(number) {
        return (number / 10000).toFixed(1) + '万'
      },

      handleSelectNavItem(index, items) {
        this.recomCurrentIndex = index
        // 判断是否选择 "为您推荐"
        let isFirstIndex = items.index === 0 ? '' : items.id
        recommend(isFirstIndex).then(res => {
          if (res.code === ERR_OK) {
            if (!isFirstIndex) {
              this.recomPlaylist = this._normalizeSongs(res.recomPlaylist.data.v_hot).slice(0,12)
              return
            }
            this.recomPlaylist = this._normalizeSongs(res.playlist.data.v_playlist, true).slice(0,12)
          }
        })
      },

      handleSelectItem(items){
        this.$emit('handleSelectRecomPlay',items)
      }

    }
  }
</script>

<style lang="stylus" scoped>
  .container {
    background linear-gradient(#f3f3f3, #fff)
    padding-bottom 20px
    .swiperWrapper {
      position relative
      >>> .swiper-wrapper {
        padding-bottom 20px
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

      .slider-prev, .slider-next {
        transition all .3s
        position: absolute
        top 50%
        transform translateY(-50%)
        display flex
        justify-content center
        align-items center
        width 79px
        height: 108px
        background rgba(0, 0, 0, .1)
        outline none
        cursor pointer
      }
      .slider-prev {
        left -79px
        .prev {
          display inline-block
          width 20px
          height: 39px
          background url("../../images/icon_sprite.png")
          background-position: -20px -120px;
        }
      }

      .slider-next {
        right -79px
        .next {
          width 20px
          height: 39px
          background url("../../images/icon_sprite.png")
          background-position: 0px -120px;
        }
      }

      &:hover {
        .slider-prev {
          left 0
        }
        .slider-next {
          right 0
        }
      }
    }

    .swiper-pagination {
      >>> .swiper-pagination-bullet-active {
        background rgba(0, 0, 0, 0.5)
      }
    }

    .swiper-container-horizontal >>> .swiper-pagination-bullets {
      bottom 0px
    }

  }

</style>
