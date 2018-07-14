<template>
  <div class="newAlbum-container">

    <m-title  :datas="newAlbumDataTitle" :currentIndex="currentIndex" @handleSelectEvent="handleSelectEvent"></m-title>

    <div class="swiperWrapper">
      <div class="swiperWrapper-outer">
        <swiper :options="swiperOptionNewSong">
          <swiper-slide class="newAlbumSlide" v-for="(items,index) in newAlbumData" :key="index">
            <div class="item" v-for="(items,index) in items" :key="items.album_id"  @click="handleSelectItem(items)">
              <div class="avatar"><img :src="items.image" alt=""></div>
              <div class="albumName"> {{items.album_name}}</div>
              <div class="singerName"> {{items.singer_name}}</div>
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
  import {newAlbumArea} from '../../api/recommend'
  import MTitle from './m-title'
  import {CreateAblum} from '../../utils/util'
  import {ERR_OK} from "../../api/config";

  export default {
    name: "focus",
    props: {
      newAlbum: {
        type: Object,
        default: {}
      }
    },
    components:{
      MTitle
    },
    data(){
      return {
        newAlbumDataTitle:[],
        currentIndex:0,
        newAlbumData:[],
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
          loop: true,
          simulateTouch: false,
          observer: true,
          observeParents: true
        }
      }
    },
    created() {
      this.newAlbumDataTitle = this._normalizeNewSong('新碟首发', this.newAlbum.tags.area)
      this.newAlbumData = this._initNewSongList(this.newAlbum.list).slice(0,4)
    },
    methods:{
      _normalizeNewSong(name, list) {
        let ret = {
          title: name,
          navList: []
        }
        list.forEach((currentVal, index) => {
          ret.navList.push({
            type: 'new_album',
            index: index,
            id: currentVal.id,
            text: currentVal.name
          })
        })
        return ret
      },

      _initNewSongList(songList) {
        const pages = []
        songList.forEach((item, index) => {
          const page = Math.floor(index / 10)   // 向下取整
          if (!pages[page]) {
            pages[page] = []
          }
          pages[page].push(new CreateAblum(item))
        })
        return pages
      },

      handleSelectEvent(index,item){
        this.currentIndex = index
        newAlbumArea(item.id).then(res => {
         if(res.code === ERR_OK){
           this.newAlbumData = this._initNewSongList(res.new_album.data.list).slice(0,4)
         }
        })
      },
      handleSelectItem(items){
        this.$emit('handleNewAblum',items)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .newAlbum-container{
    background: linear-gradient(#f3f3f3, #fff);
    padding-bottom 20px

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
        .newAlbumSlide {
          display flex
          flex-wrap wrap
          justify-content space-between
          .item{
            width 20%
            padding-bottom 25px
            .avatar{
              width 224px
              img{
                width 100%
              }
            }
            .albumName{
              padding-top 12px
              padding-bottom 6px
              font-size 15px
              color #333
              cursor pointer
              &:hover{
                color #31c27c
              }
            }
            .singerName{
              font-size 14px
              color #999
              cursor pointer
              &:hover{
                color #31c27c
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


