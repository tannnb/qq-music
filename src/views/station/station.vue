<template>
  <div class="stationWrapper">
    <div class="station-main">
      <div class="slider">
        <div class="taglist" ref='tagsWrapper' v-if="tags.length !== 0">
          <span class="taglistItem"
                @click="selectMenu(index,$event)"
                :class=" currentIndex === index? 'active':'' "
                v-for="(items,index) in tags">{{items}}</span>
        </div>
      </div>
      <div class="stationContent" ref="stationContent">
        <div class="item" ref="itemlist"
             v-if="stationList.length !== 0"
             v-for="(items,index) in stationList.groupList">
          <h4 class="title">{{items.name}}</h4>
          <ul class="radioItem">
            <li class="radioItem_li" v-for="(item,index) in items.radioList">
              <img class="avatar" :src="item.radioImg" alt="">
              <p class="radioName">{{item.radioName}}</p>
              <p class="listenNum">播放量: {{item.listenNum | listen}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Loading v-if="stationList.length === 0"></Loading>

  </div>
</template>

<script>
  import {station} from "../../api/radio";
  import {ERR_OK} from "../../api/config";
  import {paddListenCount} from "../../utils/tool";
  import Loading from '../../components/loading/loading'
  export default {
    name: "station",
    data() {
      return {
        stationList: [],
        tags: [],
        listHeight: [],
        scrollY: 0,
        stationContent:0
      }
    },
    components: {
      Loading
    },
    filters: {
      listen(count) {
        return paddListenCount(count)
      }
    },
    created() {
      this._station()
    },
    mounted() {
      setTimeout(() => {
       this.$nextTick(() => {
         this._calculateHeight();
       })
        this.stationContent = this.$refs.stationContent.offsetLeft
        this.$refs.tagsWrapper.style.left =  this.stationContent - 240 + 'px'
        this.$refs.tagsWrapper.style.opacity =  1
      }, 500)
      window.addEventListener('scroll', this.radioScroll);
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
      _station() {
        station().then(res => {
          let ret = res.data
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
        })
      },
      radioScroll() {
        this.scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        if(this.scrollY>=80){
          this.$refs.tagsWrapper.style.top = '40px'
        }else{
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
      selectMenu(index){
        document.documentElement.scrollTop = document.body.scrollTop = this.listHeight[index]
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .stationWrapper {
    padding-top 35px
    background: linear-gradient(#f3f3f3, #fff);
    .station-main {
      display flex
      width 1200px
      margin 0 auto
      .slider {
        flex 0 0 240
        width 240px
      }
      .stationContent {
        flex 1
      }
    }
  }
  .slider {
    .taglist {
      position: fixed
      left: 40px
      top: 142px
      transition all .3s
      opacity 0
      background url("./radio_sidebar.png") 0 0 no-repeat;
      .taglistItem {
        position: relative
        display: block;
        padding-left: 63px;
        line-height: 59px;
        font-size: 15px;
        cursor pointer
        &:hover {
          color: #31c27c
        }
        &.active {
          color: #31c27c
          &:after {
            content: "";
            position: absolute;
            height: 1px;
            width: 37px;
            overflow: hidden;
            left: 0;
            top: 50%;
            background-color: #31c27c;
          }
        }
        &:after {
          content: "";
          position: absolute;
          height: 1px;
          width: 37px;
          overflow: hidden;
          left: 0;
          top: 50%;
          background-color: #dadada;
        }
      }
    }
  }
  .stationContent {
    .item {
      .title {
        position: relative
        font-weight: 400;
        height: 20px;
        line-height: 20px;
        color: #828282;
        margin-bottom: 38px;
        font-size: 16px;
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
          width 25%
          padding-bottom: 44px;
          .avatar {
            width 222px
            vertical-align top
          }
          .radioName {
            padding 12px 0 6px 0
            max-width: 100%;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 22px;
            color: #333
            font-size 15px
          }
          .listenNum {
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 22px;
            font-size 14px
          }
        }
      }
    }
  }
</style>
