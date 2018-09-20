<template>
  <div class="music-header">
    <h1 class="music-logo">
      <a href="javascript:void(0)"><img src="./logo@2x.png" alt=""></a>
    </h1>
    <ul class="music-nav">
      <li class="music-nav-item"
          v-for="(items,index) in headerData"
          :key="items.id">
        <a :class='[currentIndex===index? "active":""]'
           @click="handleSelect(items)"
           :href="items.url"
           target="_blank"> {{items.label}} </a></li>
    </ul>

    <div class="music-search" v-if="$route.path !== '/music/search'">
      <div class="search-container">
        <input type="text"
               placeholder="搜索音乐、歌单"
               @focus="handleFocus"
               @blur="handleBlur"
               @keyup.enter="handleSearchPage"
               v-model="hotKeyQuery">
        <span @click.stop="handleSearchPage"><Icon-svg class="svgIcon" iconClass="search"></Icon-svg></span>
      </div>
      <transition name="down">
        <div class="search-history" v-show="search_Area">
          <ul>
            <li v-for="(items,index) in hotKey"
                :key="index"
                @click="handleSelectHotKey(items)"
                class="hotkey-item">
              <span class="rank">{{index}}</span>
              <span class="name">{{items.k}}</span>
              <span class="Playamount">{{items.n | paddListenCounts}}</span>
            </li>
          </ul>
          <div>
            <div class="searchHistory-title">
              <span>搜索历史</span>
              <span @click.stop="handleDeleteAll"> <Icon-svg class="svgIcon" iconClass="del"></Icon-svg></span>
            </div>
            <div v-if="searchHistory.length" @click.stop>
              <div class="searchItem" v-for="(items,index) in searchHistory" :key="index"
                   @click="handleSelectHotKey(items,true)">
                <span>{{items}}</span>
                <span @click.stop="handleDetele(items)"><Icon-svg class="svgIcon" iconClass="delete"></Icon-svg></span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import IconSvg from '../../components/svg-icon/svg-nav'
  import {gethotkey} from '../../api/recommend'
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import {LoadingMixin} from "../../utils/mixin";

  export default {
    mixins: [LoadingMixin],
    name: "music-header",
    props: {
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    components: {
      IconSvg
    },
    data() {
      return {
        headerData: [
          {
            label: '音乐馆',
            id: '0'
          },
          {
            label: '我的音乐',
            id: '1',
            url: 'https://y.qq.com/portal/profile.html'
          },
          {
            label: '客户端',
            id: '2',
            url: 'https://y.qq.com/download/index.html'
          },
          {
            label: '音乐号',
            id: '3',
            url: 'https://y.qq.com/vip/daren_recruit/apply.html'
          },
          {
            label: 'VIP',
            id: '4',
            url: 'https://y.qq.com/portal/vipportal/index.html'
          }
        ],
        search_Area: false,
        hotKey: '',
        hotKeyQuery: ''
      }
    },
    created() {
      this._gethotkey()
    },
    filters: {
      paddListenCounts(count) {
        return paddListenCount(count)
      }
    },
    computed: {
      ...mapGetters(['searchHistory']),
    },
    methods: {
      ...mapActions([
        'saveSearcHistory',
        'clearSearchHistory',
        'deleteSearchHistory'
      ]),
      handleSelect(items) {
        this.$emit('handleSelect', items)
      },
      handleFocus() {
        this.search_Area = true
      },
      handleBlur() {
        this.search_Area = false
      },
      handleSelectHotKey(items, flag) {
        if (flag) {
          this.hotKeyQuery = items
        } else {
          this.hotKeyQuery = items.k
        }
        this.saveSearcHistory(this.hotKeyQuery)
        this.$router.push({path: '/music/search', query: {key: this.hotKeyQuery}})
      },
      handleDeleteAll() {
        this.clearSearchHistory()
      },
      handleDetele(items) {
        this.deleteSearchHistory(items)
      },
      _gethotkey() {
        gethotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = this._normal(res.data.hotkey)
          }
        })
      },

      _normal(item) {
        return item.slice(0, 8)
      },

      handleSearchPage() {
        if (this.hotKeyQuery.length === 0) {
          this.CreateDialog({
            message: '请输入要搜索的音乐或歌单',
            confirmBtnText: '取消',
            cancelBtn: false
          })
          return
        }
        this.saveSearcHistory(this.hotKeyQuery)
        this.$router.push('/music/search')
      }

    }
  }
</script>

<style lang="stylus" scoped>

  .down-enter-active, .down-leave-active {
    transition: all 0.2s
  }

  .down-enter, .down-leave-to {
    opacity 0.5
  }

  .music-header {
    display flex
    align-items center
    max-width 1200px
    min-height 90px
    margin 0 auto
    border-bottom 1px solid #f2f2f2
    box-sizing border-box
    .container {
    }
    .music-logo {
      img {
        width 170px
        height 46px
      }
    }
    .music-nav {
      flex 1
      display flex
      margin-left 28px
      .music-nav-item {
        a {
          display block
          padding 0 20px
          line-height 90px
          height 90px
          text-align center
          font-size 18px
          font-family "Microsoft JhengHei UI"
          color #333
          text-decoration none
          &:hover {
            color: #31c27c
          }
          &.active {
            background #31c27c
            color: #fff
          }
        }
      }
    }
    .music-search {
      position: relative
      margin-left 40px
      border 1px solid #ddd
      .search-container {
        position: relative
        min-width 260px
        input {
          width 100%
          height 40px
          padding 10px 40px 10px 10px
          outline none
          font-size 14px
          box-sizing border-box
        }
        span {
          display inline-block
          position absolute
          top 0px
          right 0px
          color #9a9a9a
          padding 9px 10px
          cursor pointer
        }
        .svgIcon {
          &:hover {
            color: #31c27c
          }
        }
      }
      .search-history {
        position absolute
        z-index 10
        top 40px
        left -1px
        min-width 262px
        border 1px solid #ddd
        box-sizing border-box
        background white
        .hotkey-item {
          display flex
          line-height 38px
          font-size 15px
          cursor pointer
          &:hover {
            background #31c27c
            & >>> span {
              color: #fff
            }
          }
          .rank {
            display block
            padding 0 10px
            color: #ff6f2b
          }
          .name {
            flex: 1;
            display block
          }
          .Playamount {
            display block
            padding 0 10px
            font-size 14px
            color: #7f817f
          }
        }
        .searchHistory-title {
          display flex
          justify-content space-between
          padding 10px
          span {
            font-size 14px
            color #828282
          }
          .svgIcon {
            color #828282
            width 22px
            height 22px
            cursor pointer
          }
        }
        .searchItem {
          display flex
          justify-content space-between
          align-items center
          padding 2px 10px
          line-height 38px
          font-size 14px
          color: #474747
          cursor pointer
          &:hover {
            background #31c27c
            color #fff
          }
          .svgIcon {
            width 18px
            height 18px
            color: #fff
          }
        }
      }
    }
  }

</style>
