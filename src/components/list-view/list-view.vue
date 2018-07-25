<template>
    <ul class="list-view">
      <div class="itemFirst">
        <div class="count"></div>
        <div class="sing">歌曲</div>
        <div class="singer">歌手</div>
        <div class="albumn">专辑</div>
        <div class="time">时长</div>
      </div>
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
</template>

<script>
 import {format} from "../../utils/tool";

 export default {
    props: {
      song: {
        type: Array,
        default: []
      }
    },
    filters:{
      formats(times){
        return format(times)
      }
    },
    methods: {
      handleSelectItem(items,index){
        this.$emit('handlePlayer',items,index)
      },
      handleAppendItem(items,index){
        this.$emit('appendPlayer',items,index)
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
      font-size 13px
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

    .item {
      display flex
      font-size 14px
      line-height 50px
      height 50px
      color: #333
      .count {
        width 6%
        color: #999
        text-align center
      }
      .sing {
        position: relative
        width 48%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
        cursor pointer
        .desc {
          width 140px
          font-size 13px
          margin-left 6px
          color: #999
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        }
        .isonly {
          font-size 10px
          padding 1px 2px
          color: #31c27c
          border: 1px solid #31c27c
          border-radius 3px
        }
        .funBtn {
          display none
          justify-content space-between
          position: absolute
          right: 0px
          top: 0px
          font-size 34px
          padding 0 0 0 30px
          i {
            color: #c3c3c3
            cursor pointer
            &:hover {
              color: #31c27c
            }
          }
        }
        &:hover {
          color: #31c27c
          .funBtn:nth-child(even) {
            display block
            background #fff
          }
        }
        &:hover {
          .funBtn:nth-child(odd) {
            display block
            background #FBFBFD
          }
        }
      }
      .singer {
        width 20%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
        cursor pointer
        &:hover{
          color: #31c27c
        }
      }
      .albumn {
        width 20%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        margin-right 20px
        box-sizing border-box
        cursor pointer
        &:hover{
          color: #31c27c
        }
      }
      .time {
        width 6%
        color: #999
      }
      &:nth-child(odd) {
        background #FBFBFD
      }
    }
  }

</style>
