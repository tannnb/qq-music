<template>
  <div class="singerWrapper">
    <div class="singerBg">
      <h3 class="title">万千歌手，尽在眼前</h3>
      <img src="./bg_singer.jpg" alt="">
    </div>
    <div class="mod_singer_tag">
      <Singer-tag v-if="tags" :tag="tags.index" :currentIndex="currentIndex" @selectItemTag="selectItemIndex"/>
      <Singer-tag v-if="tags" :tag="tags.area" :currentIndex="currentArea" @selectItemTag="selectItemArea"/>
      <Singer-tag v-if="tags" :tag="tags.sex" :currentIndex="currentSex" @selectItemTag="selectItemSex"/>
      <Singer-tag v-if="tags" :tag="tags.genre" :currentIndex="currentGenre" @selectItemTag="selectItemGenre"/>
    </div>

    <div ref="singerContent" class="singerContent">
      <div v-if="currentIndex === 0" class="hotWrapper">
        <ul class="HotAvatar">
          <li class="items" v-for="(items,index) in singerList.slice(0,10)"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <img class="avatar" :src="items.singer_pic" alt="">
            <div class="singer_name">{{items.singer_name}}</div>
          </li>
        </ul>
        <ul class="defaultAvatar">
          <li class="items" v-for="(items,index) in singerList.slice(10)"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <div class="singer_name"> {{items.singer_name}}</div>
          </li>
        </ul>
      </div>

      <div class="defaultWrapper" v-if="currentIndex !== 0">
        <ul class="defaultAvatar">
          <li class="items" v-for="(items,index) in singerList"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <div class="singer_name"> {{items.singer_name}}</div>
          </li>
        </ul>
      </div>

      <div class="page-wrapper">
        <Pagination v-if="allpage>0" @pagetions="pagetions" :allpage="allpage"></Pagination>
      </div>
    </div>

    <Loading v-if="singerList.length === 0"></Loading>
    <vue-progress-bar></vue-progress-bar>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from "../../api/config";
  import SingerTag from './singertag'
  import Pagination from './pagination'
  import Loading from '../../components/loading/loading'
  import {LoadingMixin} from "../../utils/mixin"

  const COUNT = 80
  export default {
    mixins: [LoadingMixin],
    name: "singer",
    data() {
      return {
        singerList: [],
        tags: null,
        currentIndex: 0,
        currentArea: 0,
        currentSex: 0,
        currentGenre: 0,
        allpage: null,

        area: -100,
        sex: -100,
        genre: -100,
        index: -100,
        sin: 0,
        cur_page: 1
      }
    },
    components: {
      SingerTag,
      Pagination,
      Loading
    },
    created() {
      this._getSingerList()
      this.$Progress.start()
    },
    methods: {
      ...mapActions([
        'saveDiscInfo',
        'saveSingID'
      ]),
      asyncData() {
        const data = {
          "area": this.area,
          "sex": this.sex,
          "genre": this.genre,
          "index": this.index,
          "sin": this.sin,
          "cur_page": this.cur_page,
        }
        const showLoading = this.CreateLoading('歌手加载中，请稍后...')
        getSingerList(data)
          .then(res => {
            showLoading.hide()
            if (res.data.code === ERR_OK) {
              let ret = res.data.singerList.data
              this.singerList = ret.singerlist
              this.tags = ret.tags
              this.allpage = this.singerList.length
              this.$Progress.finish()
            }
          })
          .catch(e => {
            showLoading.hide()
          })
      },
      _getSingerList() {
        this.asyncData()
      },
      // 热门
      selectItemIndex(items, index) {
        this.currentIndex = index
        this.index = items.id
        this.asyncData()
      },
      // 地区
      selectItemArea(items, index) {
        this.currentArea = index
        this.area = items.id
        this.asyncData()
      },
      // 性别
      selectItemSex(items, index) {
        this.currentSex = index
        this.sex = items.id
        this.asyncData()
      },
      // 曲风
      selectItemGenre(items, index) {
        this.currentGenre = index
        this.genre = items.id
        this.asyncData()
      },
      pagetions(index) {
        this.cur_page = index
        this.sin = this.sin + COUNT
        this.asyncData()
        const scrollTop = this.$refs.singerContent.offsetTop
        setTimeout(() => {
          window.scrollTo(0, scrollTop)
        }, 300)
      },
      handleSelectItem(items) {
        this.$router.push({
          path: `/music/singer/${items.singer_mid}`
        })
        // 保存歌曲信息
        this.saveDiscInfo(items)
        this.saveSingID(items.singer_mid)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .singerWrapper {
    .singerBg {
      position: relative
      width 100%
      img {
        width 100%
        vertical-align top
        user-select: none;
      }
      .title {
        position: absolute
        top: 50%
        left 50%
        transform translate(-50%, -50%)
        font-size 60px
        font-family "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif
        color: #fff
        user-select none
      }
    }
    .mod_singer_tag {
      width 1200px
      background-color: #fbfbfd;
      padding: 34px 0 17px 40px;
      margin: 30px auto 20px;
    }
    .singerContent {
      width 1200px
      margin: 0 auto
      .hotWrapper {
        .HotAvatar {
          display flex
          justify-content space-between
          flex-wrap wrap
          .items {
            position: relative;
            width 20%
            min-height: 195px;
            padding: 25px 0;
            overflow: hidden
            text-align center
            .avatar {
              width 140px
              height: 140px
              border-radius 50%
              overflow hidden
              cursor pointer
            }
            .singer_name {
              font-size: 14px;
              font-weight: 400;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              zoom: 1;
              margin: 20px 30px 4px;
              cursor pointer
              &:hover {
                color: #31c27c
              }
            }
          }
        }
        .defaultAvatar {
          display flex
          justify-content space-between
          flex-wrap wrap
          .items {
            width 20%
            .singer_name {
              max-width: 90%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 14px;
              line-height: 36px;
              color #333
              cursor pointer
              &:hover {
                color: #31c27c
              }
            }
          }
        }
      }
      .defaultWrapper {
        .defaultAvatar {
          display flex
          justify-content space-between
          flex-wrap wrap
          .items {
            width 20%
            .singer_name {
              max-width: 90%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 14px;
              line-height: 36px;
              color #333
              cursor pointer
              &:hover {
                color: #31c27c
              }
            }
          }
        }
      }

      .page-wrapper {
        padding-top 40px
        text-align center
      }
    }
  }


</style>
