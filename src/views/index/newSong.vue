<template>
  <div class="newSong-container">
    <div class="subHeader">
      <div class="title">{{newSongPlaylistTitle.title}}</div>
      <ul class="subTitle">
        <li
          v-for="(items,index) in newSongPlaylistTitle.navList"
          @click="handleSelectNewSong(index,items)"
          data-type="items.type"
          :class=" index === currentNewSongIndex? 'active':'' "
          :key="index">{{items.text}}
        </li>
      </ul>
    </div>
    <div class="swiperWrapper">
      <div class="swiperWrapper-outer">
        <swiper :options="swiperOptionNewSong">
          <swiper-slide class="newsongSlide" v-for="(items,index) in newSongList" :key="index">
            <div
              class="newsongItem"
              @click="handleSelectItem(item)"
              v-for="(item,index) in items">
              <div class="img">
                <img :src="item.image" alt="">
              </div>
              <div class="item">
                <div class="title">{{item.title}}</div>
                <div class="name">{{item.name}}</div>
                <div class="duration">{{format(item.duration)}}</div>
              </div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="newSong-prev" slot="button-prev"><span class="prev"></span></div>
      <div class="newSong-next" slot="button-prev"><span class="next"></span></div>
    </div>
  </div>
</template>

<script>
  import {ERR_OK} from "../../api/config";
  import {newSongType} from '../../api/recommend'
  import {CreateSong} from "../../utils/util";

  export default {
    name: "newSong",
    props: {
      newSongData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        newSongPlaylistTitle: {},
        currentNewSongIndex: 0,
        newSongList: [],
        swiperOptionNewSong: {
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
          navigation: {
            nextEl: '.newSong-next',
            prevEl: '.newSong-prev'
          },
          simulateTouch: false,
          observer: true,
          observeParents: true
        }
      }
    },
    created() {
      this.newSongPlaylistTitle = this._normalizeNewSong('新歌首发', this.newSongData.type_info)
      this.newSongList = this._initNewSongList(this.newSongData.song_list.slice(0, 36))
    },
    methods: {
      _normalizeNewSong(name, list) {
        let ret = {
          title: name,
          navList: []
        }
        list.forEach((currentVal, index) => {
          ret.navList.push({
            type: 'new_song',
            index: index,
            id: currentVal.id,
            text: currentVal.title
          })
        })
        return ret
      },


      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },

      _initNewSongList(songList) {
        const pages = []
        songList.forEach((item, index) => {
          const page = Math.floor(index / 9)   // 向下取整
          if (!pages[page]) {
            pages[page] = []
          }
          pages[page].push(new CreateSong(item))
        })
        return pages
      },

      handleSelectNewSong(index, items) {
        this.currentNewSongIndex = index
        newSongType(items.id).then(res => {
          if (res.new_song.code === ERR_OK) {
            this.newSongList = this._initNewSongList(res.new_song.data.song_list.slice(0, 36))
          }
        })
      },

      handleSelectItem(item) {
        this.$emit('handleNewSong', item)
      }

    }
  }
</script>

<style lang="stylus" scoped>
  .newSong-container {
    background: linear-gradient(#f3f3f3, #fff);
    padding-bottom 20px
    .subHeader {
      width 1200px
      margin 0 auto
      .title {
        padding 50px 0 24px 0
        line-height 40px
        text-align center
        font-size 30px
        color: #545454
        letter-spacing 6px
        font-weight bold
      }
      .subTitle {
        display: flex
        justify-content center
        align-items center
        li {
          line-height 22px
          font-size 15px
          margin 0 24px
          padding-bottom 40px
          color: #333
          cursor pointer
          &:hover {
            color: #31c27c
          }
          &.active {
            color: #31c27c
          }
        }
      }
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
      .swiperWrapper-outer {
        width 1200px
        margin 0 auto
        .newsongSlide {
          display flex
          flex-wrap wrap
          justify-content space-between
          .newsongItem {
            display flex
            flex 0 0 32%
            padding-top: 12px;
            padding-bottom: 12px;
            font-size: 14px;
            box-sizing border-box
            border-bottom 1px solid #ddd
            cursor pointer
            .img {
              flex: 0 0 86
              width 86px
              height: 86px
              overflow: hidden;
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
            .item {
              flex: 1
              position: relative
              padding-left 20px
              .title {
                max-width 230px
                font-size: 16px;
                padding: 8px 0 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                &:hover {
                  color: #31c27c
                }
              }
              .name {
                font-size: 14px;
                color: #999
                padding-top 4px
                &:hover {
                  color: #31c27c
                }
              }
              .duration {
                position: absolute
                top: 50%
                right: 40px
                transform translateY(-50%)
                font-size 14px
                color: #999
              }
            }
          }
        }
      }
      .newSong-prev, .newSong-next {
        transition all .3s
        position: absolute
        top 50%
        transform translateY(-50%)
        display flex
        justify-content center
        align-items center
        width 70px
        height: 108px
        background rgba(0, 0, 0, .1)
        outline none
        cursor pointer
      }
      .newSong-prev {
        left -70px
        .prev {
          display inline-block
          width 20px
          height: 39px
          background url("../../images/icon_sprite.png")
          background-position: -20px -120px;
        }
      }

      .newSong-next {
        right -70px
        .next {
          width 20px
          height: 39px
          background url("../../images/icon_sprite.png")
          background-position: 0px -120px;
        }
      }

      &:hover {
        .newSong-prev {
          left 0
        }
        .newSong-next {
          right 0
        }
      }
    }
  }
</style>



