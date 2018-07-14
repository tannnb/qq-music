<template>
  <div class="player-list">
    <ul class="player-title">
      <li class="song">歌曲</li>
      <li class="singer">歌手</li>
      <li class="duration">时长</li>
    </ul>
    <ul class="player-list">
      <li class="items"
          v-for="(items,index) in playlist"
          :key="items.id"
          @click="handleSelectSong(index)"
          :class="currentSong.id == items.id? 'active':'' ">
        <div class="song">
          <img v-if="currentSong.id == items.id" src="./wave.gif" alt="">
          {{items.name}}</div>
        <div class="singer">{{items.singer}}</div>
        <div class="duration">{{format(items.duration)}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "player-list",
    computed: {
      ...mapGetters(['playlist','currentSong'])
    },
    methods:{
      handleSelectSong(index){
        this.$emit('handleSelectSong',index)
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
    }
  }
</script>

<style lang="stylus" scoped>

  .player-list {

  }

  .player-title {
    display flex
    color: rgba(225,225,225,.6)
    line-height 40px
    font-size 13px
    .song{
      flex 0 0 200
      width 200px
    }
    .singer{
      flex 1
      padding 0 20px
    }
    .duration{
      flex 0 0 100
      width 100px
    }
  }

  .player-list {
    .items{
      display flex
      color: rgba(225,225,225,.6)
      line-height 50px
      font-size 13px
      border-bottom 1px solid rgba(255, 255, 255, 0.07)
      .song{
        flex 0 0 200
        width 200px
      }
      .singer{
        flex 1
        padding 0 20px
      }
      .duration{
        flex 0 0 100
        width 100px
      }
      &.active {
        color:#fff
      }
    }
  }

</style>
