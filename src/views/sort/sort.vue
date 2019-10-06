<template>
  <div class="sort-wrapper">
    <div class="sort-tags-wrapper">
      <div class="categoriesWrapper" v-for="(items,indexs) in categories" :key="indexs">
        <h4 class="title">{{items.categoryGroupName}}</h4>
        <ul class="item-Wrapper">
          <li v-for="(item,index) in items.items"
              :key="index"
              class="items"
              :class=" currentIndex ===  item.categoryId? 'active':'' "
              @click="handleSelectTags(item,index)"
              v-html="item.categoryName">
          </li>
        </ul>
      </div>
    </div>
    <div class="titleTags">
      <div class="tag">
        <span v-if="currentSelect">{{currentSelect}}</span>
      </div>
      <div class="tagTab">
        <div :class="currentTagIndex === 1? 'active':'' " @click="handleTab(1)">推荐</div>
        <div :class="currentTagIndex === 2? 'active':'' " @click="handleTab(2)">最新</div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="items"
           v-for="(items,index) in SortList"
           @click="handleSelectSort(items,index)"
           :key="index">
        <div class="avatar">
          <Avatar-hover :avatarUri="items.imgurl"></Avatar-hover>
        </div>
        <div class="dissname">{{items.dissname}}</div>
        <div class="name">{{items.creator.name}}</div>
        <div class="listnum">播放量：{{items.listennum | listen}}</div>
      </div>
      <div class="page-wrapper">
        <Pagination ref="pagination" v-if="pageConfig" :page-config="pageConfig" @changeCurrentPage="pagetions"></Pagination>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getSortTags, getSortList } from '../../api/sort'
import { paddListenCount } from '../../utils/tool'
import { ERR_OK } from '../../api/config'
import Pagination from '@/components/pagination'
import AvatarHover from '../../components/AvatarHover/AvatarHover'
import { LoadingMixin, PaginationMixin } from '../../utils/mixin'

export default {
  mixins: [LoadingMixin, PaginationMixin],
  name: 'sort',
  data () {
    return {
      categories: [],
      currentIndex: null,
      currentSelect: '',
      currentTagIndex: 1,
      SortList: [],
      categoryId: 10000000,
      sortId: 5,
      sin: 0,
      pageConfig: null
    }
  },
  filters: {
    listen (count) {
      return paddListenCount(count)
    }
  },
  components: {
    Pagination,
    AvatarHover
  },
  async created () {
    this.$Progress.start()
    this.showLoading = this.CreateLoading('歌单加载中，请稍后...')
    this._getSortTags()
    await this._getSortList()
    this.$Progress.finish()
    this.showLoading.hide()
  },
  methods: {
    ...mapActions([
      'saveDiscInfo',
      'saveSingID'
    ]),
    async _getSortTags () {
      try {
        const response = await getSortTags()
        let ret = response.data.trim()
        var result = ret.replace(/\n/g, '')
        const Reg = /^\w+\(({.+})\)$/
        const matches = result.match(Reg)
        const objArr = JSON.parse(matches[1])
        if (objArr.code === ERR_OK) {
          this.categories = objArr.data.categories.slice(1)
        }
      } catch (e) {
        this.CreateDialog({
          message: '类型获取失败'
        })
      }
    },
    async _getSortList () {
      try {
        const response = await getSortList(this.categoryId, this.sortId, this.sin)
        let ret = response.data
        const Reg = /^\w+\(({.+})\)$/
        const matches = ret.match(Reg)
        const objArr = JSON.parse(matches[1])
        if (objArr.code === ERR_OK) {
          this.SortList = objArr.data.list
          this.pageConfig = this._initPagination(objArr.data.sum)
        }
        this.showToast && this.showToast.hide()
      } catch (e) {
        this.$Progress.finish()
        this.showLoading.hide()
        this.showToast && this.showToast.hide()
        this.copyrightIssue()
      }
    },

    copyrightIssue (message) {
      var vm = this
      this.CreateDialog({
        message: message || '抱歉，因版权限制,暂无法查看该专辑下歌曲！',
        confirmBtnText: '返回分类歌单',
        cancelBtn: false,
        showClose: true,
        confirmBtn () {
          vm.$router.push('/music/sort')
        }
      })
    },

    handleSelectTags (items, index) {
      this.currentIndex = items.categoryId
      this.categoryId = items.categoryId
      this.currentSelect = items.categoryName
      this.$refs.pagination.setCurrentIndex(1)
      this.showToast = this.CreateToast()
      this._getSortList()
    },
    handleTab (id) {
      this.currentTagIndex = id
      this.sortId = id
      this.showToast = this.CreateToast()
      this._getSortList()
    },
    pagetions (count) {
      this.sin = (count - 1) * 30
      this.showToast = this.CreateToast()
      this._getSortList()
    },
    handleSelectSort (items) {
      this.$router.push({
        path: `/music/sort/${items.dissid}`
      })
      // 保存专辑信息
      this.saveDiscInfo(items)
      this.saveSingID(items.dissid)
    }
  }
}
</script>

<style lang="stylus" scoped>

  .sort-wrapper {
    background: linear-gradient(#f3f3f3, #fff);
    .sort-tags-wrapper {
      width 1200px
      margin 0 auto
      padding 40px 0
      .categoriesWrapper {
        display flex
        .title {
          flex 0 0 60
          width 60px
          padding 8px
          margin 3px
          color: #999
          font-size 15px
        }
        .item-Wrapper {
          flex 1
          display flex
          .items {
            padding 8px
            margin 3px
            font-size 14px
            cursor pointer
            &.active {
              background #31c27c
              color: #fff
            }
            &:hover {
              background #31c27c
              color: #fff
            }
          }
        }
      }
    }
    .titleTags {
      display flex
      justify-content space-between
      width 1200px
      margin 0 auto
      .tag {
        span {
          padding 8px 14px
          border 1px solid #cac8c8
          color: #776767
        }
      }
      .tagTab {
        display flex
        .active {
          background #31c27c
          color: #fff
          border-color #31c27c
          margin-right -1px
          z-index 2
          &:hover {
            color: #fff
          }
        }
        div {
          padding 8px 14px
          font-size 14px
          border 1px solid #c3c3c3
          cursor pointer
          &:hover {
            color: #31c27c
          }
          &:nth-child(odd) {
            margin-right -1px
          }
        }
      }
    }
    .content-wrapper {
      display flex
      flex-flow wrap
      width 1200px
      margin 0 auto
      padding-top 20px
      .items {
        width 20%
        padding-bottom: 44px;
        .avatar {
          width 224px
          height: 224px
          cursor pointer
          img {
            width 100%
            vertical-align top
          }
        }
        .dissname {
          padding 10px 0
          font-size 14px
          color: #333
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor pointer
          &:hover {
            color: #31c27c
          }
        }
        .name {
          color: #999
          font-size 13px
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor pointer
          &:hover {
            color: #31c27c
          }
        }
        .listnum {
          padding-top 10px
          color: #999
          font-size 13px
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .page-wrapper {
        width: 100%;
        padding-top 40px
        text-align center
      }
    }
  }

</style>
