<template>
  <div class="mv-wrapper">
    <div class="mv-main">
      <div>
        <CheckTag v-if="tagArea" :tagSource="tagArea" @selectItemTag="selectItemIndex" />
        <CheckTag v-if="tagVersion" :tagSource="tagVersion" @selectItemTag="selectVersionIndex" />
      </div>
      <div>
        <div class="mvTitle">
          <div class="tagTab">
            <div :class="currentType === 1? 'active':'' " @click="handleTab(1)"><a-icon type="fire" />推荐</div>
            <div :class="currentType === 2? 'active':'' " @click="handleTab(2)">最新</div>
          </div>
        </div>
        <ul class="mvlist-content">
          <li class="item"
              v-for="(items,index) in mvlist"
              @click="handleSelectMvItem(items)"
              :key="items.mv_id">
            <Avatar-hover class="avatar" :avatarUri="items.picurl"></Avatar-hover>
            <h4 class="mvtitle">{{items.title}}</h4>
            <div class="singername">{{filterSinger(items.singers)}}</div>
            <div class="listennum"><i class="icon"></i>{{items.playcnt | listenCount}}<span class="time">{{items.pubdate}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="page-wrapper">
        <a-button type="primary" icon="plus-circle" shape="round" :loading="loading" @click="loadMore">加载更多</a-button>
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
  import CheckTag from '@/components/check-tag'
  import AvatarHover from '../../components/AvatarHover/AvatarHover'
  import Pagination from '@/components/pagination'

  import {paddListenCount} from "../../utils/tool"
  import {ERR_OK} from "../../api/config";
  import {LoadingMixin,PaginationMixin} from "../../utils/mixin";
  import DPlayer from 'dplayer';

  export default {
    mixins: [LoadingMixin,PaginationMixin],
    name: "mv",
    data() {
      return {
        tagArea:[],
        tagVersion:[],
        loading:false,
        MvData: {},
        mvlist: [],
        taglist: null,
        currentType: 1,
        currentAreaId: 0,
        currentTagId: 0,
        currentYearId: 0,
        pageno:0,
        showDplayer:false,
        pageConfig:null
      }
    },
    created() {
      this._getMvlist()
    },
    components: {
      Tags,
      CheckTag,
      AvatarHover,
      Pagination,
    },
    methods: {
      ...mapMutations({
        setPlayState: 'SET_PLAYING_STATE'
      }),

      loadMore() {

      },

      selectItemIndex(item,index) {
      console.log(item,index)
      },
      selectVersionIndex(item,index) {
        console.log(item,index)
      },

      _getMvlist() {
        this.$Progress.start()
        getMvlist().then(res => {
          let result = res.data
          this.$Progress.finish()
          if (result.code === ERR_OK) {
            this.mvlist = result.mv_list.data.list
            console.log(this.mvlist)
            let tagResult = result.mv_tag.data
            this.tagArea = tagResult.area
            this.tagVersion = tagResult.version
          }
        }).catch(e => {
          this.$Progress.finish()
          this.CreateDialog({
            message: '暂时无法获取到MV信息'
          })
        })
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
                autoplay: false
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
        this.pageno = item
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
    .mv-main {
      width 1200px
      margin 0 auto
      .mvTitle {
        display flex
        justify-content space-between
        padding 30px 0 10px 0
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
      .mvlist-content {
        display flex
        flex-flow wrap
        width 1200px
        margin 0 auto
        padding-top 20px

        .item {
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
            height: 150px
            margin 0 auto
            cursor pointer
            img {
              width 100%
              vertical-align top
            }
          }
          .mvtitle {
            padding 0 10px
            margin-top 15px
            font-size 14px
            color: #000
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            cursor pointer
            &:hover {
              color: #2a62ff
            }
          }
          .singername {
            font-size 13px
            padding 10px 0
            cursor pointer
            color #868686
          }
          .listennum {
            font-size 13px
            color #868686
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
