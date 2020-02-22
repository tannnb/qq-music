<template>
  <div class="stationWrapper">
    <div class="station-main">
      <a-anchor class="slider" :offsetTop="offsetTop"
                :bounds="30"
                :showInkInFixed="false">
        <a-anchor-link v-for="(items,index) in tags" :key="index" :href="`${hrefPrex}/#${items}`" :title="items" />
      </a-anchor>
      <div class="stationContent" ref="stationContent">
        <div :id="`${items.name}`" class="item" ref="itemlist"
             v-if="stationList.length !== 0"
             v-for="(items,index) in stationList.groupList">
          <h4 class="title">{{items.name}}</h4>
          <ul class="radioItem">
            <li class="radioItem_li"
                v-for="(item,index) in items.radioList"
                :key="item.radioId"
                @click.stop="handelClickRadio(item)">
              <div class="avatar">
                <Avatar-hover :avatar-uri="item.radioImg"></Avatar-hover>
              </div>
              <p class="radioName">{{item.radioName}}</p>
              <p class="listenNum"><a-icon type="sound" /> 播放量: {{item.listenNum | listen}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {station, getRadioDesc, createSong} from "../../api/radio";
  import {processSongsUrl} from "../../api/songList";
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import AvatarHover from '../../components/AvatarHover/AvatarHover'
  import {LoadingMixin} from "../../utils/mixin"
  export default {
    mixins: [LoadingMixin],
    name: "station",
    data() {
      return {
        offsetTop:100,
        stationList: [],
        tags: [],
        listHeight: [],
        scrollY: 0,
        stationContent: 0
      }
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      }
    },
    components:{
      AvatarHover
    },
    created() {
      this._station()
    },
    mounted() {
      this.hrefPrex = window.location.href
     /* setTimeout(() => {
        this.$nextTick(() => {
          this._calculateHeight();
        })
        this.stationContent = this.$refs.stationContent.offsetLeft
        this.$refs.tagsWrapper.style.left = this.stationContent - 240 + 'px'
        this.$refs.tagsWrapper.style.opacity = 1
      }, 500)
      window.addEventListener('scroll', this.radioScroll);*/
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      async _station() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('电台加载中，请稍后...')
        try {
          const response = await station()
          this.showLoading.hide()
          this.$Progress.finish()
          let ret = response.data
          const reg = /^\w+\(({.+})/
          const matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1] + '}')
          }
          if (ret.code === ERR_OK) {
            this.stationList = ret.data.data
            this.tags = this.stationList.groupList.map((currentVal) => {
              return currentVal.name
            })
          }
        }catch (e) {
          this.$Progress.finish()
          this.showLoading.hide()
        }
      },
      radioScroll() {
        this.scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        if (this.scrollY >= 80) {
          this.$refs.tagsWrapper.style.top = '40px'
        } else {
          this.$refs.tagsWrapper.style.top = '142px'
        }
      },
      // 获取所有tag对应高度
      _calculateHeight() {
        let itemList = this.$refs.itemlist
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < itemList.length; i++) {
          let item = itemList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index) {
        document.documentElement.scrollTop = document.body.scrollTop = this.listHeight[index]
      },
      async handelClickRadio(item) {
        if (Number(item.radioId) === 99) {
          const h = this.$createElement;
          this.$info({
            title: '提示',
            centered:true,
            content: h('div', {}, [
              h('p', '个性电台需要登录,暂时无法收听！'),
            ]),
            okText: '确认',
          });
          return
        }
        try {
          // 获取随机歌曲信息
          const res = await getRadioDesc(item.radioId)
          const {songlist} = res.data
          if (songlist.code === ERR_OK) {
            const track_list = songlist.data.track_list
            try {
              // 获取播放地址
              const songsData = await processSongsUrl(this._normalizeSongs(track_list))
              this.songs = songsData.filter((currentSong) => {
                return currentSong.url.length !== 0
              })
              this.selectPlay({
                list: this.songs,
                index: 0
              })
            } catch (e) {
              this.$warning({
                centered:true,
                title: '提示',
                content: '歌曲地址获取失败',
                okText: '确认',
              });
            }
          }
        } catch (e) {
          this.$error({
            centered:true,
            title: '提示',
            content: '电台获取失败',
            okText: '确认',
          });
        }
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.mid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.radioScroll);
    }
  }
</script>

<style lang="stylus">
  .stationWrapper {
    .ant-affix {
       box-shadow none
    }
    .ant-anchor-link {
      font-size 15px
      padding 15px 0 15px 15px
      &.ant-anchor-link-active {
        .ant-anchor-link-title {
          color #2a62ff !important
        }
      }
    }
    .ant-anchor-ink {
      &::before {
        background transparent !important
      }
      .ant-anchor-ink-ball {
        border-color #2a62ff !important
      }
    }
  }
</style>
<style lang="stylus" scoped>
  .stationWrapper {
    padding-top 35px
    .station-main {
      display flex
      width 1200px
      margin 0 auto
      .slider {
        flex 0 0 120
        width 120px
      }
      .stationContent {
        flex 1
        margin-left 40px
      }
    }
  }
  .slider {
    .taglistItem {
      position: relative
      display: block;
      line-height: 50px;
      text-align center
      font-size: 15px;
      cursor pointer
    }
  }
  .stationContent {
    .title {
      position: relative
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      color: #2f2f2f;
      margin-bottom: 38px;
      font-size: 18px;
      &:after {
        content: "";
        position: absolute;
        height: 1px;
        overflow: hidden;
        left: 43px;
        right: 0;
        top: 10px;
        background-color: #ececec;
      }
    }
    .radioItem {
      display flex
      flex-wrap wrap
      .radioItem_li {
        width 20%
        padding 10px
        margin-bottom: 20px;
        border 1px solid rgba(195, 195, 195, 0.1)
        transition all .5s
        cursor pointer
        .avatar {
          width 100%
          overflow hidden
          cursor pointer
          img {
            vertical-align top
            width 100% !important
            transition all .2s
            &:hover {
              transform scale(1.1)
            }
          }
        }
        .radioName {
          padding 12px 0 6px 10px
          max-width: 100%;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 22px;
          color: #333
          font-size 15px
          cursor pointer
        }
        .listenNum {
          padding-left 10px
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 22px;
          font-size 13px
        }
        &:hover {
          z-index 2
          box-shadow: 0 5px 18px 0 rgba(78, 125, 255, 0.3);
          border:1px solid rgba(63, 102, 255, 0.2)
        }
      }
    }
  }
</style>
