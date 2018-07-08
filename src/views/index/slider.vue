<template>
  <div class="banner-container">
    <div class="title">精彩推荐</div>
    <div class="swiperWrapper">
      <div class="swiperWrapper-outer">
        <swiper :options="swiperOptionNewSong">
          <swiper-slide class="bannerItem" v-for="(items,index) in bannerCount" :key="index">
            <div v-for="(item,index) in items" class="item">
              <img :src="item.url" alt="">
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
  import {musicu} from '../../api/recommend'
  import {ERR_OK} from "../../api/config";
  import {CreateBanner} from '../../utils/util'

  export default {
    name: "slider",
    props: {
      focus: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        bannerCount: [],
        swiperOptionNewSong: {
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
          observer: true,
          observeParents: true
        }
      }
    },
    created() {
      this.bannerCount = this._initNewSongList(this.focus).slice(0, 3)
    },
    methods: {
      _initNewSongList(songList) {
        const pages = []
        songList.forEach((item, index) => {
          const page = Math.floor(index / 2)   // 向下取整
          if (!pages[page]) {
            pages[page] = []
          }
          pages[page].push(new CreateBanner({
            mid: item.jump_info.url,
            url: item.pic_info.url
          }))
        })
        return pages
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .banner-container {
    background: linear-gradient(#f3f3f3, #fff);
    padding-bottom 30px
    .title {
      width 1200px
      margin 0 auto
      padding 50px 0 24px 0
      line-height 40px
      text-align center
      font-size 30px
      color: #545454
      letter-spacing 6px
      font-weight bold
    }
    .swiperWrapper {
      position: relative
      >>> .swiper-wrapper {
        padding-bottom 30px
      }
      .swiper-pagination {
        >>> .swiper-pagination-bullet-active {
          background rgba(0, 0, 0, 0.5)
        }
      }

      .swiper-container-horizontal >>> .swiper-pagination-bullets {
        bottom 0px
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

      .swiperWrapper-outer {
        width 1200px
        margin 0 auto
        .bannerItem {
          display flex
          justify-content space-between
          .item {
            flex 0 0 49%
            width 48%
            img {
              width 100%
              vertical-align top
            }
          }
        }
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

</style>
