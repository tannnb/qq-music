<template>
  <div class="container">
    <MusicSubheader :content="recomPlaylistTitle"
                    :currentIndex="recomCurrentIndex"
                    @handleSelectItem="handleSelectNavItem"/>
    <div class="swiperWrapper">
      <div class="swiperWrapper-outer" v-if="recomPlaylist && recomPlaylist.length !== 0">
        <swiper :options="swiperOption" ref="swiper_hook">
          <swiper-slide v-for="items in recomPlaylist" :key="items.id">
            <div class="playlist_item_box" @click="handleSelectItem(items)">
              <div class="coverImg">
                <img :src="items.image" :key="items.image"/>
              </div>
             <div class="coverTxt">
               <p class="title">{{items.title}}</p>
               <p class="listen_num">播放量:{{items.duration | listen}}</p>
             </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="slider-swiper-pagination"></div>
        <div class="sliderList-prev" slot="button-prev"><img class="prev" src="../../images/prev.png" alt=""></div>
        <div class="sliderList-next" slot="button-prev"><img class="next" src="../../images/next.png" alt=""></div>
      </div>
      <a-spin v-if="loading" class="spinLoading-pos">
        <a-icon slot="indicator" type="loading" class="spinLoading" spin />
      </a-spin>
    </div>
  </div>
</template>

<script>
  import {ERR_OK} from "../../api/config";
  import {config} from './config'
  import {paddListenCount} from "../../utils/tool";
  import {Createrecommend} from '../../utils/util'
  import {recommend} from '../../api/recommend'
  import MusicSubheader from '../../components/music-subHeader/music-subHeader'
  import AvatarHover from '../../components/AvatarHover/AvatarHover'

  export default {
    props: {
      recomPlaylistData: {
        type: Array,
        default: []
      }
    },
    components: {
      MusicSubheader,
      AvatarHover
    },
    data() {
      return {
        loading:false,
        recomPlaylist: [],
        recomPlaylistTitle: config.recommendPlaylistTitle,
        recomCurrentIndex: 0,
        swiperOption: {
          pagination: {
            el: '.slider-swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
          navigation: {
            nextEl: '.sliderList-next',
            prevEl: '.sliderList-prev'
          },
          loop: true,
          simulateTouch: true,
          slidesPerView: 4,
          spaceBetween :20,
          observer: true,
          observeParents: true
        }
      }
    },
    created() {
      this.recomPlaylist = this._normalizeSongs(this.recomPlaylistData)
    },
    methods: {
      handleSelectNavItem(index, items) {
        this.loading = true
        // this.$refs.swiper_hook.swiper.slideTo(-1, 1000, false);//切换到第一个slide，速度为1秒
        this.recomPlaylist = []
        this.recomCurrentIndex = index
        // 判断是否选择 "为您推荐"
        let isFirstIndex = items.index === 0 ? '' : items.id
        recommend(isFirstIndex).then(res => {
          this.loading = false
          if (res.code === ERR_OK) {
            if (!isFirstIndex) {
              this.recomPlaylist = this._normalizeSongs(res.recomPlaylist.data.v_hot).slice(0, 15)
              return
            }
            this.recomPlaylist = this._normalizeSongs(res.playlist.data.v_playlist, true).slice(0, 15)
          }
        }).catch(() => {
          this.loading = false
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
      handleSelectItem(items) {
        this.$emit('handleSelectRecomPlay', items)
      }
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      }
    }
  }
</script>
<style lang="stylus">
  .container {
    .slider-swiper-pagination{
      position: relative
      bottom 0px
      transform translateY(-50%)
      text-align center
      .swiper-pagination-bullet{
        margin 0 5px
        outline none
      }
    }
  }
</style>
<style lang="stylus" scoped>
  .container {
    padding 40px 0 20px 0
    .swiperWrapper {
      position relative
      min-height 120px
      >>> .swiper-wrapper {
        padding-bottom 20px
      }
      .swiperWrapper-outer {
        position: relative
        width 1200px
        margin 0 auto
        .swiper-slide{
          padding: 10px 20px 20px 20px;
          border:1px solid #f5f8ff
          box-shadow 0 5px 18px 0 rgba(238,242,255,.72)
        }

        .sliderList-prev, .sliderList-next {
          position: absolute
          top 40%
          transform translateY(-50%)
          width 27px
          height: 26px
          outline none
          cursor pointer
          transition all .3s
          z-index 40
        }
        .sliderList-prev {
          left:-50px
        }
        .sliderList-next {
          right:-50px
        }

      }
      .spinLoading-pos{
        position: absolute
        left: 50%
        top:50px
        transform translate(-50%)
        z-index: 100
      }
      .spinLoading {
        color: #3f66ff
        font-size:24px
      }
      .playlist_item_box {
        display flex
        align-items center
        .coverImg{
          width 60px
          border-radius 50px
          overflow hidden
          img {
            width 100%
            vertical-align top
          }
        }
        .coverTxt{
          flex:1
          padding-left 10px
        }
        .title {
          padding-bottom 8px
          font-size 14px
          line-height 18px
          color: #545454
          cursor pointer

          &:hover {
            color: #3f66ff
          }
        }
        .listen_num {
          font-size 13px
          color: #999
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
