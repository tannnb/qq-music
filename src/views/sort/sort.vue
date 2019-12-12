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
      <div class="tagTab">
        <div :class="currentTagIndex === 1? 'active':'' " @click="handleTab(1)"><a-icon type="fire" /> 推荐</div>
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
        <div class="listnum"><a-icon type="sound" /> 播放量：{{items.listennum | listen}}</div>
      </div>
      <div class="page-wrapper">
        <a-button type="primary" icon="plus-circle" shape="round" :loading="loading" @click="loadMore">加载更多</a-button>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getSortTags, getSortList } from '@/api/sort'
import { paddListenCount } from '@/utils/tool'
import { ERR_OK } from '@/api/config'
import AvatarHover from '@/components/AvatarHover/AvatarHover'
import { LoadingMixin } from '@/utils/mixin'

export default {
  mixins: [LoadingMixin],
  name: 'sort',
  data () {
    return {
      loading:false,
      categories: [],
      currentIndex: null,
      currentTagIndex: 1,
      SortList: [],
      categoryId: 10000000,
      sortId: 5,
      sin: 0,
      pageNum:2
    }
  },
  filters: {
    listen (count) {
      return paddListenCount(count)
    }
  },
  components: {
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
        this.loading = false
        let ret = response.data
        const Reg = /^\w+\(({.+})\)$/
        const matches = ret.match(Reg)
        const objArr = JSON.parse(matches[1])
        if (objArr.code === ERR_OK) {
          this.SortList = this.SortList .concat(objArr.data.list)
        }
        this.showToast && this.showToast.hide()
      } catch (e) {
        this.loading = false
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
      this.SortList = []
      this.currentIndex = items.categoryId
      this.categoryId = items.categoryId
      this.showToast = this.CreateToast()
      this._getSortList()
    },
    handleTab (id) {
      this.SortList = []
      this.currentTagIndex = id
      this.sortId = id
      this.showToast = this.CreateToast()
      this._getSortList()
    },
    async loadMore () {
      this.loading = true
       this.sin = (this.pageNum - 1) * 30
      this.showToast = this.CreateToast()
      await this._getSortList()
      this.pageNum++
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
          flex 0 0 50
          width 50px
          padding 8px
          margin 3px
          color: #1a1a1a
          font-size 14px
        }
        .item-Wrapper {
          flex 1
          display flex
          align-items center
          .items {
            padding 5px 12px
            font-size 13px
            cursor pointer
            margin-right 4px
            border-radius: 24px
            border: 1px solid transparent;
            white-space nowrap
            color #494949
            &.active {
              border: 1px solid #2a62ff;
              background: linear-gradient(0deg, #2a62ff, #4e7dff);
              box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
              color: #fff
            }
            &:hover {
                box-sizing border-box
                background: #fafbff;
                border: 1px solid #eee;
                box-shadow: 0 5px 6px 0 rgba(217, 219, 227, .22), 0 3px 1px 0 rgba(250, 251, 255, .1);
                color #3b426b;
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
          color: #fff
          border: 1px solid #2a62ff;
          background: linear-gradient(0deg, #2a62ff, #4e7dff);
          box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
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
            border: 1px solid #2a62ff;
            background: linear-gradient(0deg, #2a62ff, #4e7dff);
            box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
            color: #fff
          }
          &:first-child {
            border-radius 30px 0 0 30px
          }
          &:last-child{
            border-radius 0 30px 30px 0
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
        padding 10px 0 20px 0
        text-align center
        margin-bottom 10px
        border:1px solid #f5f8ff
        cursor pointer
        transition all .5s
        border-radius 4px
        &:hover {
          z-index 2
          box-shadow: 0 5px 18px 0 rgba(78, 125, 255, 0.3);
          border:1px solid rgba(63, 102, 255, 0.2)
        }
        .avatar {
          width 224px
          height: 224px
          margin 0 auto
          cursor pointer
          img {
            width 100%
            vertical-align top
          }
        }
        .dissname {
          padding 20px 0
          font-size 14px
          color: #333
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor pointer
        }
        .name {
          color: #999
          font-size 13px
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor pointer
        }
        .listnum {
          padding-top 10px
          color: #999
          font-size 12px
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
