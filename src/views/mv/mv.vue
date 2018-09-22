<template>
  <div class="mv-wrapper">
    <div class="mv-main">
      <div>
        <Tags v-if="taglist" titleName="地区" :tag="taglist.area" :currentId="currentAreaId"
              @selectItemTag="selectAreaIndex"/>
        <Tags v-if="taglist" titleName="类型" :tag="taglist.tag" :currentId="currentTagId"
              @selectItemTag="selectTagIndex"/>
        <Tags v-if="taglist" titleName="年份" :tag="taglist.year" :currentId="currentYearId"
              @selectItemTag="selectYearIndex"/>
      </div>
      <div>
        <div class="mvTitle">
          <h2 class="title">全部MV</h2>
          <div class="tagTab">
            <div :class="currentType === 1? 'active':'' " @click="handleTab(1)">推荐</div>
            <div :class="currentType === 2? 'active':'' " @click="handleTab(2)">最新</div>
          </div>
        </div>
        <ul class="mvlist-content">
          <li class="item"
              v-for="(items,index) in mvlist"
              @click="handleSelectMvItem(items)"
              :key="items.mv_id">
            <Avatar-hover :avatarUri="items.picurl"></Avatar-hover>
            <h4 class="mvtitle">{{items.mvtitle}}</h4>
            <div class="singername">{{filterSinger(items.singers)}}</div>
            <div class="listennum"><i class="icon"></i>{{items.listennum | listenCount}}<span class="time">{{items.publictime}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="page-wrapper">
        <Pagination v-if="allpage>0" @pagetions="pagetions" :allpage="allpage"></Pagination>
      </div>
    </div>

    <transition name="fade">
      <div class="dplayer" v-if="showDplayer">
        <div class="close-Dplayer"><i @click="closeplayer" class="icon-delete"></i></div>
        <div ref="dplayer" ></div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {getMvlist} from "../../api/mv";
  import {getSingerMvUrl} from "../../api/singer"
  import Tags from '../../components/Tags/Tags'
  import AvatarHover from '../../components/AvatarHover/AvatarHover'
  import Pagination from '../singer/pagination'
  import {paddListenCount} from "../../utils/tool"
  import {ERR_OK} from "../../api/config";
  import {LoadingMixin} from "../../utils/mixin";
  import DPlayer from 'DPlayer';

  export default {
    mixins: [LoadingMixin],
    name: "mv",
    data() {
      return {
        MvData: {},
        mvlist: [],
        taglist: null,
        currentType: 1,
        currentAreaId: 0,
        currentTagId: 0,
        currentYearId: 0,
        pageno:0,
        allpage:null,
        showDplayer:false,
      }
    },
    created() {
      this._getMvlist()
    },
    components: {
      Tags,
      AvatarHover,
      Pagination
    },
    methods: {
      ...mapMutations({
        setPlayState: 'SET_PLAYING_STATE'
      }),

      async _getMvlist() {
        this.$Progress.start()
        this.showLoading = this.CreateLoading('MV信息加载中，请稍后...')
        try {
          const response = await getMvlist({
            type: this.currentType,
            year: this.currentYearId,
            area: this.currentAreaId,
            tag: this.currentTagId,
            pageno:this.pageno
          })
          this.$Progress.finish()
          this.showLoading.hide()
          let ret = response.data
          var reg = /^\w+\(({.+})/
          var matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1] + '}')
          }
          if (ret.code === ERR_OK) {
            this.MvData = ret.data
            this.mvlist = this.MvData.mvlist
            this.allpage = this.MvData.sum
            this.taglist = this.MvData.taglist
          }
        } catch (e) {
          this.$Progress.finish()
          this.showLoading.hide()
          this.CreateDialog({
            message: '暂时无法获取到MV信息'
          })
        }
      },

      selectAreaIndex(item) {
        this.currentAreaId = item.id
        this.pageno = 0
        this._getMvlist()
      },
      selectTagIndex(item) {
        this.currentTagId = item.id
        this.pageno = 0
        this._getMvlist()
      },
      selectYearIndex(item) {
        this.currentYearId = item.id
        this.pageno = 0
        this._getMvlist()
      },

      handleTab(id) {
        this.currentType = id
        this.pageno = 0
        this._getMvlist()
      },

      async handleSelectMvItem(items){
        const vid = items.vid
        const response = await getSingerMvUrl(vid)
        if(response.data.code === ERR_OK){
          const MvUrlData = response.data.getMvUrl
          if(MvUrlData.code === ERR_OK){
            const mvUrl_mp4 = MvUrlData.data[vid].mp4

            const result = []
            for(let i=0;i<mvUrl_mp4.length;i++){
              if(mvUrl_mp4[i].freeflow_url.length !== 0){
                for(let j=0;j<mvUrl_mp4[i].freeflow_url.length;j++){
                  result.unshift(mvUrl_mp4[i].freeflow_url[j])
                }
              }
            }

            if(result.length === 0){
              this.CreateDialog({
                message: message ? message : '该歌手MV因版权问题,暂时无法播放！',
                confirmBtnText: '取消',
                cancelBtn: false
              })
              return
            }

            this.showDplayer = true
            this.setPlayState(false)
            this.$nextTick(() => {
              const dp = new DPlayer({
                container:this.$refs.dplayer,
                video: {
                  url: result[0],
                  pic: items.picurl
                },
                autoplay: true
              })
            })
          }
        }
      },

      closeplayer(){
        this.showDplayer = false
        this.setPlayState(true)
      },

      pagetions(item){
        this.pageno = item - 1
        this._getMvlist()
      },

      filterSinger(singer) {
        let ret = []
        if (!singer) {
          return ''
        }
        singer.forEach((s) => {
          ret.push(s.name)
        })
        return ret.join('/')
      }

    },
    filters: {
      listenCount(number) {
        return paddListenCount(number)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .mv-wrapper {
    padding-top 35px
    background: linear-gradient(#f3f3f3, #fff);
    .mv-main {
      width 1200px
      margin 0 auto
      .mvTitle {
        display flex
        justify-content space-between
        padding 30px 0 10px 0
        .title {
          font-weight bold
          font-size 18px
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
      .mvlist-content {
        display: flex
        justify-content space-between
        flex-wrap wrap
        .item {
          width 24%
          padding-bottom: 44px
          height 100%
          color: #999
          .mvtitle {
            margin-top 15px
            font-size 14px
            color: #000
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            cursor pointer
            &:hover {
              color: #31c27c
            }
          }
          .singername {
            font-size 13px
            padding 6px 0
            cursor pointer
            &:hover {
              color: #31c27c
            }
          }
          .listennum {
            font-size 13px
            .icon {
              display: inline-block;
              width: 19px;
              height: 12px;
              margin-right: 5px;
              vertical-align: -1px;
              background url("../../images/icon_sprite.png") no-repeat
              background-position: -180px -20px;
            }
            .time {
              padding-left 20px
            }
          }
        }
      }
      .page-wrapper {
        padding-top 40px
        text-align center
      }
    }
    .dplayer{
      position: fixed
      top: 0
      bottom: 0
      width 100%
      z-index 100
      background rgb(52, 52, 52)
      &.fade-enter-active, &.fade-leave-active {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }
      &.fade-enter, &.fade-leave-to {
        opacity 0
      }
      .close-Dplayer{
        position: fixed
        top: 30px
        right 30px
        color: #fff
        z-index: 102
        .icon-delete{
          font-size 34px
          color: rgba(255, 255, 255, 0.5)
          cursor: pointer
          &:hover{
            color: #fff
          }
        }
      }
    }
  }

</style>
