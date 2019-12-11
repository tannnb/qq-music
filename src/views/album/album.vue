<template>
    <div class="albumWrapper" :spinning="spinning" tip="加载中...">
        <div class="album-tags-wrapper">
            <div class="tagItem">

                <Check-Tag class="singer-tag" v-if="albumTags&&albumTags.area" :tagSource="albumTags.area"
                           :currentIndex="currentAreaIndex" @selectItemTag="selectItemAreaIndex"/>
            </div>
            <div v-show="currentAreaIndex !== 0" class="tagItem">
                <span class="title">流派</span>
                <Check-Tag class="singer-tag" v-if="albumTags&&albumTags.genre" :tagSource="albumTags.genre"
                           :currentIndex="currentGenreIndex" @selectItemTag="selectItemGenreIndex"/>
            </div>
            <div v-show="currentAreaIndex !== 0" class="tagItem">
                <span class="title">类别</span>
                <Check-Tag class="singer-tag" v-if="albumTags&&albumTags.type" :tagSource="albumTags.type"
                           :currentIndex="currentTypeIndex" @selectItemTag="selectItemTypeIndex"/>
            </div>
            <div v-if="currentAreaIndex !== 0" class="tagItem">
                <span class="title">筛选</span>
                <div class="select">
                    <div class="selectItem">
                        <a-popover placement="bottomLeft" trigger="click" v-model="selectItemvisible">
                            <template @click="hide" slot="content">
                                <ul style="width: 1000px" class="posItem" v-show="selectItemIndex === 1">
                                    <li v-for="(items,index) in albumTags.year" @click="selectItemYear(items,index)">
                                        {{items.name}}
                                    </li>
                                </ul>
                            </template>
                            <div class="name" @click.stop="selectYear" :class=" selectItemIndex ===1 ? 'active':'' ">
                                {{defaultYear}}
                            </div>
                        </a-popover>
                    </div>
                    <div class="selectItem">
                        <a-popover placement="bottomLeft" trigger="click" v-model="selectItemVisibleCompany">
                            <template @click="hide" slot="content">
                                <ul style="width: 1000px" class="posItem" v-show="selectItemIndex === 2">
                                    <li v-for="(items,index) in albumTags.company.slice(0,23)"
                                        @click="selectItemCompany(items,index)">{{items.name}}
                                    </li>
                                </ul>
                            </template>
                            <div class="name" @click.stop="selectCompany" :class=" selectItemIndex ===2 ? 'active':'' ">
                                {{defaultCompany}}
                            </div>
                        </a-popover>
                    </div>
                </div>
            </div>
        </div>


        <div class="album-content-wrapper">
            <div class="defaultTitle">
               <!-- <a-breadcrumb>
                    <a-breadcrumb-item>内地</a-breadcrumb-item>
                    <a-breadcrumb-item>流行</a-breadcrumb-item>
                    <a-breadcrumb-item>专辑</a-breadcrumb-item>
                    <a-breadcrumb-item>2016</a-breadcrumb-item>
                </a-breadcrumb>-->
                {{defaultTitle}}</div>
            <ul class="content-items">
                <li v-for="(items,index) in albumList"
                    class="items"
                    @click="selectAlbumItem(items,index)"
                    :key="items.album_id">
                    <div class="avatar">
                        <Avatar-hover :avatarUri="_addUri(items.album_mid)"></Avatar-hover>
                    </div>
                    <p class="name">{{items.album_name}}</p>
                    <p class="singer">{{items.singers | filterSingers}}</p>
                    <p class="time">{{items.public_time}}</p>
                </li>
            </ul>
            <div class="page-wrapper">
                <a-pagination :current="cur_page" :hideOnSinglePage="true" :total="total" @change="changeCurrentPage" :itemRender="itemRender" />
            </div>
        </div>

        <vue-progress-bar></vue-progress-bar>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { filterSinger } from '../../utils/tool'
  import { getAlbum } from '../../api/album'
  import { ERR_OK } from '../../api/config'
  import CheckTag from '@/components/check-tag'
  import SingerTag from '../singer/singertag'
  import { LoadingMixin, PaginationMixin } from '../../utils/mixin'
  import AvatarHover from '@/components/AvatarHover/AvatarHover'


    const COUNT = 20
  export default {
    mixins: [LoadingMixin, PaginationMixin],
    data () {
      return {
          spinning:false,
        albumList: [],
        albumTags: {},
        albumTagsArea: [],

        currentAreaIndex: 0,
        currentGenreIndex: 0,
        currentTypeIndex: 0,
        selectItemIndex: 0,

        selectItemvisible: false,
        selectItemVisibleCompany: false,
        defaultYear: '年代',
        defaultCompany: '唱片公司',
        defaultTitle: '',

        area: 7, // 地区
        company: -1, // 唱片公司
        genre: -1, // 流派
        type: -1, // 类型
        year: -1, // 年代
        sin: 0, // 分页页数
          cur_page:1,
          total:0,
      }
    },
    components: {
      SingerTag,
      CheckTag,
      AvatarHover,
    },
    created () {
      this._getAlbum()
    },
    filters: {
      filterSingers (singer) {
        return filterSinger(singer)
      },
    },
    mounted () {
      document.addEventListener('click', () => {
        this.selectItemIndex = 0
        this.selectItemvisible = false
      }, false)
    },
    methods: {
      ...mapActions([
        'saveDiscInfo',
        'saveSingID',
      ]),
        changeCurrentPage (index) {
            this.cur_page = index
            this.sin = (index - 1) * COUNT
            this._getAlbum()
            let scrollTop = 90
            setTimeout(() => {
                document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
            },30)
        },
        itemRender(current, type, originalElement) {
            if (type === 'prev') {
                return <a>上一页</a>;
            } else if (type === 'next') {
                return <a>下一页</a>;
            }
            return originalElement;
        },
      hide () {
        this.selectItemvisible = false
        this.selectItemVisibleCompany = false
      },
      async _getAlbum () {
        const data = {
          area: this.area,
          company: this.company,
          genre: this.genre,
          type: this.type,
          year: this.year,
          sin: this.sin,
        }
        this.$Progress.start()
        this.showToast = this.CreateToast()
        //  const showLoading = this.CreateLoading('专辑列表加载中，请稍后...')
        try {
          const response = await getAlbum(data)
          if (response.data.code === ERR_OK) {
            const data = response.data.albumlib.data
            this.albumList = data.list // list
            this.albumTags = data.tags // tag
            this.albumTagsArea = this._initnormalize(data.tags) // initAreaTag
            this.total = data.total
            this.$Progress.finish()
            this.showToast.hide()
          }
        } catch (e) {
          this.$Progress.finish()
          this.showToast.hide()
        }
      },
      _initnormalize (tags) {
        let area = tags.area
        area.unshift({
          'area': 0,
          'end': 0,
          'id': 7,
          'name': '推荐',
          'start': 0,
          'tjreport': 0,
        })
        return area
      },

      _addUri (mid) {
        return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
      },

      // 地区
      selectItemAreaIndex (items, index) {
        this.currentAreaIndex = index
        this.area = items.id
        this.defaultTitle = items.name
        this._getAlbum()
      },
      selectItemGenreIndex (items, index) {
          this.cur_page = 1
        this.currentGenreIndex = index
        this.genre = items.id
        this._getAlbum()
      },
      selectItemTypeIndex (items, index) {
          this.cur_page = 1
        this.currentTypeIndex = index
        this.type = items.id
        this._getAlbum()
      },

      selectYear () {
        this.selectItemIndex = 1
      },
      selectCompany () {
          this.cur_page = 1
        this.selectItemIndex = 2
      },
      selectItemYear (items, index) {
          this.cur_page = 1
        this.defaultYear = items.name
        this.year = items.id
        this._getAlbum()
        this.selectItemvisible = false
      },
      selectItemCompany (items, index) {
        this.defaultCompany = items.name
        this.company = items.id
        this._getAlbum()
        this.selectItemVisibleCompany = false
      },

      // 选择专辑
      selectAlbumItem (items, index) {
        this.$router.push({
          path: `/music/album/${items.album_mid}`,
        })
        // 保存专辑信息
        this.saveDiscInfo(items)
        this.saveSingID(items.album_mid)
      },
      pagetions (index) {
        let currentSin = index - 1
        this.sin = (currentSin * 10) + (currentSin * 10)
        this._getAlbum()
        setTimeout(() => {
          document.documentElement.scrollTop = document.body.scrollTop = 0
        }, 200)
      },
    },
  }
</script>

<style lang="stylus">
    .posItem {
        display flex
        flex-flow wrap

        li {
            padding 4px 12px
            color #333
            border-radius: 19px
            font-size 13px
            cursor pointer
            margin 8px 4px 8px 0
            border: 1px solid transparent;

            &:hover {
                box-sizing border-box
                background: #fafbff;
                border: 1px solid #eee;
                box-shadow: 0 5px 6px 0 rgba(217, 219, 227, .22), 0 3px 1px 0 rgba(250, 251, 255, .1);
                color #3b426b
            }

            &.active {
                border: 1px solid #2a62ff;
                background: linear-gradient(0deg, #2a62ff, #4e7dff);
                box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
                color: #fff
            }
        }
    }
</style>
<style lang="stylus" scoped>
    .albumWrapper {
        .album-tags-wrapper {
            width 1200px
            padding-top 40px
            margin 0 auto

            .tagItem {
                position: relative

                .title {
                    position: absolute
                    top: 6px
                    left: 0
                    font-size 14px
                    color: #000
                }

                .singer-tag {
                    padding-left 66px
                }

                .select {
                    display flex
                    padding-left: 66px;

                    .selectItem {
                        z-index 3

                        .name {
                            padding 4px 12px
                            color #333
                            border-radius: 19px
                            font-size 14px
                            cursor pointer
                            margin-right 4px
                            border: 1px solid transparent;

                            &:hover {
                                box-sizing border-box
                                background: #fafbff;
                                border: 1px solid #eee;
                                box-shadow: 0 5px 6px 0 rgba(217, 219, 227, .22), 0 3px 1px 0 rgba(250, 251, 255, .1);
                                color #3b426b;
                            }

                            &.active {
                                border: 1px solid #2a62ff;
                                background: linear-gradient(0deg, #2a62ff, #4e7dff);
                                box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
                                color: #fff
                            }
                        }
                    }
                }
            }
        }

        .album-content-wrapper {
            width 1200px
            margin 0 auto

            .defaultTitle {
                font-size 24px
                font-weight 700
                padding 20px 0
            }

            .content-items {
                display flex
                flex-flow wrap
                justify-content center

                .items {
                    width 20%
                    padding 5px 0
                    margin-bottom 20px
                    border:1px solid #f5f8ff
                    box-shadow 0 5px 18px 0 rgba(238,242,255,.72)
                    cursor pointer
                    &:hover {
                        .name {
                            color: #3f66ff
                        }
                        border:1px solid rgba(63, 102, 255, 0.2)
                    }
                    .avatar {
                        width 224px
                        margin  0 auto
                    }

                    .name {
                        font-size 14px
                        color: #333
                        padding 10px 0 12px 14px
                        max-width: 100%;
                        font-weight: 400;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        line-height: 22px;
                        max-height: 44px;
                        cursor pointer
                    }

                    .singer, .time {
                        font-size 12px
                        padding-bottom 6px
                        padding-left 14px
                        color: #999;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .singer {
                        cursor pointer
                    }
                }
            }
        }

        .page-wrapper {
            text-align center
        }
    }

</style>
