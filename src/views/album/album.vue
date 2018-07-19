<template>
  <div class="albumWrapper">
    <div class="album-tags-wrapper">
      <div class="tagItem">
        <Singer-tag class="singer-tag" v-if="albumTags&&albumTags.area" :tag="albumTags.area" :currentIndex="currentAreaIndex" @selectItemTag="selectItemAreaIndex"></Singer-tag>
      </div>
      <div v-show="currentAreaIndex !== 0" class="tagItem">
        <span class="title">流派</span>
        <Singer-tag class="singer-tag" v-if="albumTags&&albumTags.genre" :tag="albumTags.genre"
                    :currentIndex="currentGenreIndex" @selectItemTag="selectItemGenreIndex"></Singer-tag>
      </div>
      <div v-show="currentAreaIndex !== 0" class="tagItem">
        <span class="title">类别</span>
        <Singer-tag class="singer-tag" v-if="albumTags&&albumTags.type" :tag="albumTags.type"
                    :currentIndex="currentTypeIndex" @selectItemTag="selectItemTypeIndex"></Singer-tag>
      </div>
      <div v-if="currentAreaIndex !== 0" class="tagItem">
        <span class="title">筛选</span>
        <div class="select">
          <div class="selectItem ">
            <div class="name" @click.stop="selectYear" :class=" selectItemIndex ===1 ? 'active':'' ">{{defaultYear}}
            </div>
            <ul class="posItem" v-show="selectItemIndex === 1">
              <li v-for="(items,index) in albumTags.year" @click="selectItemYear(items,index)">{{items.name}}</li>
            </ul>
          </div>
          <div class="selectItem">
            <div class="name" @click.stop="selectCompany" :class=" selectItemIndex ===2 ? 'active':'' ">
              {{defaultCompany}}
            </div>
            <ul class="posItem" v-show="selectItemIndex === 2">
              <li v-for="(items,index) in albumTags.company.slice(0,23)" @click="selectItemCompany(items,index)">
                {{items.name}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="album-content-wrapper">
      <div>{{defaultTitle}}</div>
      <ul class="content-items">
        <li v-for="(items,index) in albumList"
            class="items"
            :key="items.album_id">
          <img class="avatar" :src="_addUri(items.album_mid)">
          <div class="name">{{items.album_name}}</div>
          <div class="singer">{{filterSinger(items.singers)}}</div>
          <div class="time">{{items.public_time}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getAlbum} from "../../api/album";
  import {ERR_OK} from "../../api/config";
  import SingerTag from '../singer/singertag'

  export default {
    data() {
      return {
        albumList: [],
        albumTags: {},
        albumTagsArea: [],

        currentAreaIndex: 0,
        currentGenreIndex: 0,
        currentTypeIndex: 0,
        selectItemIndex: 0,
        defaultYear: '年代',
        defaultCompany: '唱片公司',
        defaultTitle: '',

        area: 7,   //地区
        company: -1,  // 唱片公司
        genre: -1,   // 流派
        type: -1,   // 类型
        year: -1    // 年代
      }
    },
    components: {
      SingerTag
    },
    created() {
      this._getAlbum()
    },
    mounted() {
      document.addEventListener('click', () => {
        this.selectItemIndex = 0
      }, false)
    },
    methods: {
      _getAlbum() {
        const data = {
          area: this.area,
          company: this.company,
          genre: this.genre,
          type: this.type,
          year: this.year
        }
        getAlbum(data).then(res => {
          if (res.data.code === ERR_OK) {
            // list
            this.albumList = res.data.albumlib.data.list
            // tag
            this.albumTags = res.data.albumlib.data.tags
            // initAreaTag
            this.albumTagsArea = this._initnormalize(res.data.albumlib.data.tags)
            console.log(this.albumList)
          }
        })
      },
      _initnormalize(tags) {
        let area = tags.area
        area.unshift({
          "area": 0,
          "end": 0,
          "id": 7,
          "name": '推荐',
          "start": 0,
          "tjreport": 0
        })
        return area
      },

      _addUri(mid) {
        return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
      },

      filterSinger(singer) {
        let ret = []
        if (!singer) {
          return ''
        }
        singer.forEach((s) => {
          ret.push(s.singer_name)
        })
        return ret.join('/')
      },

      // 地区
      selectItemAreaIndex(items, index) {
        this.currentAreaIndex = index
        this.area = items.id
        this.defaultTitle = items.name
        this._getAlbum()
      },
      selectItemGenreIndex(items, index) {
        this.currentGenreIndex = index
        console.log(items)
      },
      selectItemTypeIndex(items, index) {
        this.currentTypeIndex = index
        console.log(items)
      },

      selectYear() {
        this.selectItemIndex = 1
      },
      selectCompany() {
        this.selectItemIndex = 2
      },
      selectItemYear(items, index) {
        this.defaultYear = items.name
        console.log(items.name)
      },
      selectItemCompany(items, index) {
        this.defaultCompany = items.name
        console.log(items)
      }

    }
  }
</script>

<style lang="stylus" scoped>

  .albumWrapper {
    background: linear-gradient(#f3f3f3, #fff);
    padding-bottom 20px
    .album-tags-wrapper {
      width 1200px
      padding-top 60px
      padding-left 65px
      margin 0 auto
      .tagItem {
        position: relative
        .title {
          position: absolute
          top: 6px
          left: 0
          font-size 14px
          color: #333
        }
        .singer-tag {
          padding-left 66px
        }
        .select {
          display flex
          padding-left: 66px;
          .selectItem {
            position: relative
            .name {
              height: 26px;
              line-height: 27px;
              overflow: hidden;
              padding: 0 8px;
              margin: 0 12px 14px 0;
              color: #333;
              font-size: 14px;
              cursor: pointer;
              &.active {
                background: #31c27c;
                color: #fff;
              }
            }
            .posItem {
              display flex
              flex-flow wrap
              position absolute
              top 28px
              left -66px
              width 1106px
              padding 19px 10px 6px 66px
              box-sizing border-box
              box-shadow 0 0 10px rgba(183, 183, 183, .65)
              li {
                height: 26px;
                line-height: 27px;
                overflow: hidden;
                padding: 0 8px;
                margin: 0 12px 14px 0;
                color: #333;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                  background: #31c27c;
                  color: #fff;
                }
                &.active {
                  background: #31c27c;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
    .album-content-wrapper {
      width 1200px
      margin 0 auto
      .content-items {
        display flex
        flex-flow wrap
        .items {
          width 20%
          .avatar {
            width 224px
            height: 224px
            img {
              width 100%
              vertical-align top
            }
          }
          .name {
            font-size 15px
            color: #333
            padding 4px 0
          }
        }
      }
    }
  }

</style>

<!--

y.gtimg.cn/music/photo_new/T002R300x300M000001l5Hzc4PKkwb.jpg?max_age=2592000




-->

