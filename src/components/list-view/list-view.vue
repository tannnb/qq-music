<template>
    <div>
      <ul class="list-view">
        <li class="item">
          <div class="count"></div>
          <div class="sing">歌曲</div>
          <div class="singer">歌手</div>
          <div class="albumn">专辑</div>
          <div class="time">时长</div>
        </li>
        <li class="item" v-for="(items,index) in song" :key="index">
          <div class="count">{{index+1}}</div>
          <div class="sing">{{items.name}}</div>
          <div class="singer">{{items.singer}}</div>
          <div class="albumn">{{items.album}}</div>
          <div class="time">{{items.duration}}</div>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
       props:{
         song:{
           type:Array,
           default:[]
         }
       }
    }
</script>

<style lang="stylus" scoped>

  .list-view{
    width 860px
    .item{
      display flex
      line-height 50px
      height 50px
      .count{
        width 6%
        font-size 13px
        padding-left 10px
        color: #999
      }
      .sing{
        width 48%
        font-size:14px
        color: #333
      }
      .singer{
        width 20%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        padding 0 20px
        font-size:14px
        color: #333
      }
      .albumn{
        width 20%
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        padding 0 20px
        font-size:14px
        color: #333
      }
      .time{
        width 6%
      }
      &:nth-child(1){
        font-size 15px !important
        color: #999 !important
      }
      &:nth-child(odd){
        background #FBFBFD
      }
    }
  }

</style>
