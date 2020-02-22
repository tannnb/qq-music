<template>
  <div class="list-view">
    <div class="itemFirst">
      <div class="count"></div>
      <div class="sing">歌曲</div>
      <div class="singer">歌手</div>
      <div class="albumn">专辑</div>
      <div class="time">时长</div>
    </div>
    <ul class="flow" :class="isFlow? 'flowActive':''">
      <li class="item" v-for="(items,index) in song" :key="index">
        <div class="count">{{index+1}}</div>
        <div class="sing">
          <span>{{items.name}} </span>
          <span class="desc" v-if="items.albumdesc">{{items.albumdesc}}</span>
          <span class="isonly" v-if="items.isonly === 1"> 独家 </span>
          <div class="funBtn">
            <i class="icon-play" @click="handleSelectItem(items,index)"></i>
            <i class="icon-add" @click="handleAppendItem(items,index)"></i>
          </div>
        </div>
        <div class="singer">{{items.singer}}</div>
        <div class="albumn">{{items.album}}</div>
        <div class="time">{{items.duration | formats}}</div>
      </li>
    </ul>
    <div v-if="song && song.length > 10" class="checkMore" @click="handleMore">{{iconText}}<a-icon :type="iconType" theme="filled" /></div>
  </div>
</template>

<script>
import { format } from '@/utils/tool'

export default {
  props: {
    song: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    formats (times) {
      return format(times)
    }
  },
  data () {
    return {
      iconType:'caret-down',
      iconText:"查看更多",
      isFlow: false
    }
  },
  methods: {
    handleMore() {
      if(this.isFlow) {
        this.isFlow = false
        this.iconText = '查看更多'
        this.iconType = 'caret-down'
      }else {
        this.isFlow = true
        this.iconText = '折叠'
        this.iconType = 'caret-up'
      }
    },
    handleSelectItem (items, index) {
      this.$emit('handlePlayer', items, index)
    },
    handleAppendItem (items, index) {
      this.$emit('appendPlayer', items, index)
    }
  }
}
</script>

<style lang="stylus" scoped>

  .list-view {
    width 100%
    .itemFirst {
      display flex
      line-height 50px
      height 50px
      font-size 15px
      color: #999
      background #FBFBFD
      .count {
        width 6%
        text-align center
      }
      .sing {
        width 48%
        margin-right 20px
        box-sizing border-box
      }
      .singer {
        width 20%
        margin-right 20px
        box-sizing border-box
      }
      .albumn {
        width 20%
        margin-right 20px
        box-sizing border-box
      }
      .time {
        width 6%
      }
    }

    .flow {
      height 500px
      overflow hidden
      transition all .5s
      &.flowActive {
        transition all .5s
        height auto
        overflow auto
      }
    }
    .checkMore {
      margin 30px auto 0 auto
      color #8c8c8c
      text-align center
      cursor pointer
      &:hover {
        text-decoration underline
        color: #4e7dff
      }
    }
    .item {
      display flex
      font-size 14px
      line-height 50px
      height 50px
      color: #333
      background #fff
      border-bottom 1px solid #f7f7f7
      cursor pointer
      .count {
        width 6%
        font-size 14px
        color: #999
        text-align center
      }
      .sing {
        position: relative
        width 48%
        font-size 14px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
        .desc {
          width 140px
          font-size 12px
          margin-left 6px
          color: #999
        }
        .isonly {
          font-size 10px
          padding 1px 2px
          color: #4e7dff
          border: 1px solid #4e7dff
          border-radius 3px
        }
        .funBtn {
          cursor pointer
          display none
          justify-content space-between
          position: absolute
          right: 0px
          top: 0px
          font-size 34px
          padding 0 30px
          i {
            color: #c3c3c3
            cursor pointer
            &:hover {
              color: #4e7dff
            }
          }
        }
        &:hover {
          color: #4e7dff
          .funBtn {
            display block
            background #FFF
          }
        }
      }
      .singer {
        width 20%
        overflow hidden
        font-size 13px
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
      }
      .albumn {
        width 20%
        overflow hidden
        font-size 12px
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
      }
      .time {
        width 6%
        color: #999
      }
      &:hover {
        box-shadow: 0 0 18px 0 rgba(238,242,255,1);
        z-index 10
      }
    }
  }

</style>
