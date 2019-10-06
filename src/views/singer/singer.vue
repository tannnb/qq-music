<template>
  <a-spin :spinning="spinning" tip="加载中...">
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
          <div class="HotAvatar">
            <a-card hoverable>
              <a-card-grid class="items" v-for="items in singerList.slice(0,10)" :key="items.singer_id"  @click.stop="handleSelectItem(items)">
                <img class="avatar" v-lazy="items.singer_pic"/>
                <div class="singer_name">{{items.singer_name}}</div>
              </a-card-grid>
            </a-card>
            <a-card hoverable>
              <a-card-grid class="subItems" v-for="items in singerList.slice(10)" :key="items.singer_id"  @click.stop="handleSelectItem(items)">
                <a-tooltip placement="top" :title="items.singer_name">
                  <div class="singer_name">{{items.singer_name}}</div>
                </a-tooltip>
              </a-card-grid>
            </a-card>
          </div>
        </div>
        <div v-if="currentHot !== 0" class="defaultWrapper" >
          <div class="defaultAvatar">
            <a-card hoverable>
              <a-card-grid class="subItems" v-for="items in singerList" :key="items.singer_id"  @click.stop="handleSelectItem(items)">
                <a-tooltip placement="top" :title="items.singer_name">
                  <div class="singer_name">{{items.singer_name}}</div>
                </a-tooltip>
              </a-card-grid>
            </a-card>
          </div>
        </div>

        <div class="noSinger" v-if="singerList && singerList.length === 0">该分类下暂无歌手！</div>

        <div v-if="singerList && singerList.length > 0" class="page-wrapper">
          <a-pagination :current="cur_page" :hideOnSinglePage="true" :total="total" @change="changeCurrentPage" :itemRender="itemRender" />
        </div>
      </div>

      <vue-progress-bar />

    </div>
  </a-spin>
</template>

<script>
import { mapActions } from 'vuex'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import CheckTag from '@/components/check-tag'
import Pagination from '@/components/pagination'
import { LoadingMixin, PaginationMixin } from '@/utils/mixin'

const COUNT = 80
export default {
  mixins: [LoadingMixin, PaginationMixin],
  name: 'singer',
  data () {
    return {
      spinning:false,
      total:0,
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
    getPopupContainer(trigger) {
      return trigger.parentElement
    },
    itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
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
    asyncData () {
      const data = {
        'area': this.area,
        'sex': this.sex,
        'genre': this.genre,
        'index': this.index,
        'sin': this.sin,
        'cur_page': this.cur_page
      }
      this.spinning = true
      getSingerList(data).then(res => {
        this.spinning = false
        const { code, singerList } = res.data
        if (code === ERR_OK) {
          let ret = singerList.data
          this.singerList = ret.singerlist
          this.tags = ret.tags
          this.allpage = this.singerList.length
          this.total = ret.total
        }
        this.$Progress.finish()
      }).catch(() => {
        this.spinning = false
        this.$Progress.finish()
      })
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
      border: 1px solid #fbfbfd
      padding: 20px 0 20px 40px;
      margin: 30px auto 20px;
      transition all .4s
      cursor: pointer
      &:hover {
        box-shadow: 0 5px 6px 0 rgba(73,105,230,.1);
      }
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
            width 20%
            overflow: hidden
            text-align center
            .avatar {
              width 100px
              height: 100px
              vertical-align top
            }
            .singer_name {
              padding 5px 0
              font-size: 15px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: rgba(0, 0, 0, 0.85);
              font-weight: 500;
            }
          }
          .subItems{
            width 10%
            text-align center
            .singer_name{
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              &:hover {
                color: #2a62ff
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
          .subItems {
            width 20%
            .singer_name {
              text-align center
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 14px;
              line-height: 36px;
              color #333
              cursor pointer
              &:hover {
                color: #2a62ff
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
