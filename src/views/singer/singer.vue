<template>
  <div class="singerWrapper">
    <div class="singerBg">
      <h3 class="title">万千歌手，尽在眼前</h3>
      <img src="./bg_singer.jpg" alt="">
    </div>
    <div class="mod_singer_tag">
      <CheckTag v-if="tags" :tagSource="tags.index" @selectItemTag="selectItemIndex" />
      <CheckTag v-if="tags" :tagSource="tags.area" @selectItemTag="selectItemArea" />
      <CheckTag v-if="tags" :tagSource="tags.sex" @selectItemTag="selectItemSex" />
      <CheckTag v-if="tags" :tagSource="tags.genre" @selectItemTag="selectItemGenre" />
    </div>

    <div ref="singerContent" class="singerContent">
      <div v-if="currentHot === 0" class="hotWrapper">
        <ul class="HotAvatar">
          <li class="items" v-for="items in singerList.slice(0,10)"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <img class="avatar" v-lazy="items.singer_pic"  alt="">
            <div class="singer_name">{{items.singer_name}}</div>
          </li>
        </ul>
        <ul class="defaultAvatar">
          <li class="items" v-for="items in singerList.slice(10)"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <div class="singer_name"> {{items.singer_name}}</div>
          </li>
        </ul>
      </div>

      <div v-if="currentHot !== 0" class="defaultWrapper" >
        <ul class="defaultAvatar">
          <li class="items" v-for="items in singerList"
              @click.stop="handleSelectItem(items)"
              :key="items.singer_id">
            <div class="singer_name"> {{items.singer_name}}</div>
          </li>
        </ul>
      </div>

      <div class="noSinger" v-if="singerList && singerList.length === 0">该分类下暂无歌手！</div>

      <div v-if="singerList && singerList.length > 0" class="page-wrapper">
        <Pagination ref="Pagination" v-if="pageConfig" :page-config="pageConfig" @changeCurrentPage="changeCurrentPage"></Pagination>
      </div>
    </div>

    <vue-progress-bar />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getSingerList } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import CheckTag from '@/components/check-tag'
import Pagination from '@/components/pagination'
import { LoadingMixin, PaginationMixin } from '../../utils/mixin'

const COUNT = 80
export default {
  mixins: [LoadingMixin, PaginationMixin],
  name: 'singer',
  data () {
    return {
      singerList: [],
      tags: null,
      allpage: null,
      currentHot: 0,
      area: -100,
      sex: -100,
      genre: -100,
      index: -100,
      sin: 0,
      cur_page: 1,
      pageConfig: null
    }
  },
  components: {
    Pagination,
    CheckTag
  },
  created () {
    this.$Progress.start()
    this._getSingerList()
  },
  methods: {
    ...mapActions([
      'saveDiscInfo',
      'saveSingID'
    ]),
    asyncData () {
      const data = {
        'area': this.area,
        'sex': this.sex,
        'genre': this.genre,
        'index': this.index,
        'sin': this.sin,
        'cur_page': this.cur_page
      }
      this.showToast = this.CreateToast()
      getSingerList(data).then(res => {
        this.showToast.hide()
        const { code, singerList } = res.data
        if (code === ERR_OK) {
          let ret = singerList.data
          this.singerList = ret.singerlist
          this.tags = ret.tags
          this.allpage = this.singerList.length
          this.pageConfig = this._initPagination(ret.total)
        }
        this.$Progress.finish()
      }).catch(() => {
        this.showToast.hide()
        this.$Progress.finish()
      })
    },

    _getSingerList () {
      this.asyncData()
    },
    // 热门
    selectItemIndex (items, index) {
      this.currentHot = index
      this.index = items.id
      this.__init__()
    },
    // 地区
    selectItemArea (items, index) {
      this.area = items.id
      this.__init__()
    },
    // 性别
    selectItemSex (items, index) {
      this.sex = items.id
      this.__init__()
    },
    // 曲风
    selectItemGenre (items, index) {
      this.genre = items.id
      this.__init__()
    },
    __init__ () {
      let Pagination = this.$refs.Pagination
      if (Pagination && Pagination !== null) Pagination.setCurrentIndex(1)
      this.sin = 0
      this.cur_page = 1
      this.asyncData()
    },
    changeCurrentPage (index) {
      this.cur_page = index
      this.sin = (index - 1) * COUNT
      this.asyncData()
      let scrollTop = 90 + 50 + 280
      setTimeout(() => {
        document.documentElement.scrollTop = document.body.scrollTop = Math.abs(scrollTop)
      }, 300)
    },

    handleSelectItem (items) {
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
              &:hover {
                box-shadow 0 0 10px #ccc
              }
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

      .noSinger {
        padding 60px 0
        font-size 15px
        text-align center
        color #ccc
      }
      .page-wrapper {
        padding-top 40px
        text-align center
      }
    }
  }

</style>
