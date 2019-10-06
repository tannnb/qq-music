<template>
    <a-affix :offsetTop="offsetTop">
        <div class="music-header">
            <div class="music-logo"></div>
            <a-tabs :defaultActiveKey="activeKey" @change="handleHeaderNav">
                <a-tab-pane v-for="item in headerData" :key="item.url" :tab="item.label"/>
            </a-tabs>

            <div class="music-search" v-if="$route.path !== '/music/search'">
                <div class="search-container">
                    <a-input v-model="hotKeyQuery"
                             class="searchInput"
                             placeholder="搜索音乐、歌单"
                             @focus="handleFocus"
                             @blur="handleBlur"
                             @pressEnter="handleSearchPage">
                        <a-icon slot="prefix" type="search"/>
                        <a-icon v-if="hotKeyQuery" slot="suffix" type="close-circle" @click="emitEmpty"/>
                    </a-input>
                </div>
                <transition name="down">
                    <div class="search-history" v-show="search_Area">
                        <ul>
                            <li v-for="(items,index) in hotKey"
                                :key="index"
                                @click="handleSelectHotKey(items)"
                                class="hotkey-item">
                                <span class="rank">{{index + 1}}</span>
                                <span class="name">{{items.k}}</span>
                                <span class="Playamount">{{items.n | paddListenCounts}}</span>
                            </li>
                        </ul>
                        <div>
                            <div class="searchHistory-title">
                                <span>搜索历史</span>
                                <span @click.stop="handleDeleteAll" class="clearHistory">
                                    <a-icon type="delete"/>
                                </span>
                            </div>
                            <div v-if="searchHistory.length" @click.stop>
                                <div class="searchItem" v-for="(items,index) in searchHistory" :key="index"
                                     @click="handleSelectHotKey(items,true)">
                                    <span>{{items}}</span>
                                    <span @click.stop="handleDetele(items)"><Icon-svg class="svgIcon"
                                                                                      iconClass="delete"></Icon-svg></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
                <transition name="down">
                    <div class="queryText" v-if="queryFlag">
                        <ul>
                            <li class="item" v-for="items in searchQueryData" :key="items.id"
                                @click="handleQueryClick(items)"
                            > {{items.name}} - {{items.singer}}
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </div>
    </a-affix>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import IconSvg from '@/components/svg-icon/svg-nav'
  import { gethotkey } from '@/api/recommend'
  import { ERR_OK } from '@/api/config'
  import { paddListenCount } from '@/utils/tool'
  import { LoadingMixin } from '@/utils/mixin'
  import { clientSmartBox } from '@/api/search'
  import { debounce } from '@/utils/tool'

  export default {
    mixins: [LoadingMixin],
    name: 'music-header',
    props: {
      currentIndex: {
        type: Number,
        default: 0,
      },
    },
    components: {
      IconSvg,
    },
    data () {
      return {
        activeKey: '/music/index',
        offsetTop: 0,
        headerData: [
          {
            label: '首页',
            url: '/music/index',
          },
          {
            label: '歌手',
            url: '/music/singer',
          },
          {
            label: '专辑',
            url: '/music/album',
          },
          {
            label: '排行榜',
            url: '/music/rank',
          },
          {
            label: '分类歌单',
            url: '/music/sort',
          },
          {
            label: '电台',
            url: '/music/station',
          },
          {
            label: 'MV',
            url: '/music/mv',
          },
          {
            label: '搜索',
            url: '/music/search',
          },
        ],
        search_Area: false,
        queryFlag: false,
        hotKey: '',
        hotKeyQuery: '',
        searchQueryData: [],
      }
    },
    created () {
      this._gethotkey()
    },
    filters: {
      paddListenCounts (count) {
        return paddListenCount(count)
      },
    },
    computed: {
      ...mapGetters(['searchHistory']),
    },
    mounted () {
      this.$watch('hotKeyQuery', debounce((newQuery) => this.searchQuery()))
    },
    methods: {
      ...mapActions([
        'saveSearcHistory',
        'clearSearchHistory',
        'deleteSearchHistory',
      ]),
      paddListenCount,
      handleHeaderNav (item) {
        this.$router.push({path: item})
      },
      emitEmpty () {
        this.hotKeyQuery = ''
      },

      handleSelect (items) {
        this.$emit('handleSelect', items)
      },
      handleFocus () {
        this.search_Area = true
      },
      handleBlur () {
        this.search_Area = false
        this.queryFlag = false
      },
      handleSelectHotKey (items, flag) {
        if (flag) {
          this.hotKeyQuery = items
        } else {
          this.hotKeyQuery = items.k
        }
        this.saveSearcHistory(this.hotKeyQuery)
        this.$router.push({path: '/music/search', query: {key: this.hotKeyQuery}})
      },

      handleQueryClick (item) {
        this.saveSearcHistory(item.name)
        this.queryFlag = false
        this.hotKeyQuery = ''
        this.$router.push({path: '/music/search', query: {key: item.name}})
      },
      searchQuery () {
        if (!this.hotKeyQuery) {
          this.queryFlag = false
          return
        }
        this.queryFlag = true
        clientSmartBox(this.hotKeyQuery).then(res => {
          const {data, code} = res.data
          if (code === ERR_OK && data.song) {
            this.search_Area = false
            this.searchQueryData = data.song.itemlist
            console.log(data.song.itemlist)
          }
        })
      },

      handleDeleteAll () {
        const _this = this
        this.$confirm({
          type: 'info',
          title: '提示',
          centered: true,
          content: '是否清除当前搜索历史记录?',
          iconType: 'exclamation-circle',
          okText: '确认',
          cancelText: '取消',
          onOk () {
            _this.clearSearchHistory()
          },
        })
      },
      handleDetele (items) {
        this.deleteSearchHistory(items)
      },
      _gethotkey () {
        gethotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = this._normal(res.data.hotkey)
          }
        })
      },

      _normal (item) {
        return item.slice(0, 8)
      },

      handleSearchPage () {
        if (this.hotKeyQuery.length === 0) {
          this.$confirm({
            type: 'warning',
            title: '提示',
            centered: true,
            content: '请输入要搜索的音乐或歌单',
            iconType: 'exclamation-circle',
            okText: '确认',
            cancelText: '取消',
          })
          return
        }
        this.saveSearcHistory(this.hotKeyQuery)
        this.$router.push('/music/search')
      },

    },
  }
</script>
<style lang="stylus">
    .ant-affix {
        background white
    }

    .components-input-demo-presuffix, .anticon-close-circle {
        cursor: pointer;
        color: #ccc;
        transition: color 0.3s;
        font-size: 12px;
    }

    .components-input-demo-presuffix, .anticon-close-circle:hover {
        color: #999;
    }

    .components-input-demo-presuffix, .anticon-close-circle:active {
        color: #666;
    }
</style>

<style lang="stylus" scoped>


    .down-enter-active, .down-leave-active {
        transition: all 0.2s
    }

    .down-enter, .down-leave-to {
        opacity 0.5
    }


    .music-header {
        position: relative
        display flex
        align-items center
        max-width 1200px
        margin 10px auto
        box-sizing border-box

        .music-logo {
            width 110px
            height 40px
            margin-right 30px
            background #eee
        }

        .music-nav {
            flex 1
            display flex
            margin-left 28px

            .music-nav-item {
                a {
                    display block
                    padding 0 20px
                    text-align center
                    font-size 14px
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
            .searchInput {
                position: absolute
                width: 240px
                top: 10px
                right: 0;

                input {
                    border-radius 0 !important
                }
            }

            .search-history {
                position absolute
                z-index 10
                top 41px
                right 0
                min-width 239px
                border 1px solid #ddd
                box-sizing border-box
                background white

                .hotkey-item {
                    display flex
                    line-height 28px
                    font-size 12px
                    cursor pointer

                    &:hover {
                        background #4e7dff

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
                        font-size 12px
                        color: #7f817f
                    }
                }

                .searchHistory-title {
                    display flex
                    justify-content space-between
                    padding 10px

                    span {
                        font-size 13px
                        color #828282
                    }

                    .clearHistory {
                        cursor: pointer

                        &:hover {
                            color: #4e7dff
                        }
                    }

                }

                .searchItem {
                    display flex
                    justify-content space-between
                    align-items center
                    padding 2px 10px
                    line-height 28px
                    font-size 14px
                    color: #474747
                    cursor pointer

                    &:hover {
                        background #4e7dff
                        color #fff
                    }

                    .svgIcon {
                        width 12px
                        height 12px
                        color: #fff
                    }
                }
            }

            .queryText {
                position absolute
                z-index 20
                top 41px
                right 0
                min-width 239px
                border 1px solid #ddd
                box-sizing border-box
                background white

                .item {
                    padding 10px
                    font-size: 13px
                    color: #5f5d5d
                    cursor: pointer
                    text-overflow ellipsis
                    white-space nowrap
                    overflow hidden

                    &:hover {
                        background #4e7dff
                        color #fff
                    }
                }
            }

        }
    }

</style>
