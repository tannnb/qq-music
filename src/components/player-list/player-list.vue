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
          :class="currentSong.id == items.id? 'active':'' ">
        <div class="song">
          <div>
            <img v-if="playing && currentSong.id == items.id"
                 class="palyGif"
                 src="./wave.gif"
                 alt="">{{items.name}}
          </div>
          <div class="user-fun-btn">
            <i class="icon-play" @click="handleSelectSong(index)" alt="播放当前歌曲"></i>
           <!-- <a class="downIcon icon-down" :href="items.url" download="items.name" target="_blank" :alt="items.name"></a>-->
          </div>
        </div>
        <div class="singer">{{items.singer}}</div>
        <div class="duration">{{items.duration | formats}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { format } from '../../utils/tool'

  export default {
    name: 'player-list',
    computed: {
      ...mapGetters(['playlist', 'currentSong', 'playing']),
    },
    filters: {
      formats (times) {
        return format(times)
      },
    },
    methods: {
      handleSelectSong (index) {
        this.$emit('handleSelectSong', index)
      },
    },
  }
</script>

<style lang="stylus" scoped>

  .player-list {

  }

  .player-title {
    display flex
    color: rgba(225, 225, 225, .6)
    line-height 40px
    font-size 13px

    .song {
      flex 1
      padding-right 20px
    }

    .singer {
      flex 0 0 200
      width 200px
      padding 0 20px
    }

    .duration {
      flex 0 0 100
      width 100px
    }
  }

  .player-list {
    .items {
      display flex
      color: rgba(225, 225, 225, .6)
      line-height 50px
      font-size 13px
      border-bottom 1px solid rgba(255, 255, 255, 0.07)

      .song {
        flex 1
        display flex
        justify-content space-between
        align-items center
        padding-right 20px
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        .palyGif {
          padding-right 10px
        }

        .user-fun-btn {
          display flex
        }

        i, .downIcon {
          display none
          font-size: 38px
          margin-right 20px
          cursor pointer

          &:hover {
            color: #fff
          }
        }

        &:hover {
          i, .downIcon {
            display block
          }
        }
      }

      .singer {
        flex 0 0 200
        width 200px
        padding 0 20px
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .duration {
        flex 0 0 100
        width 100px
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &.active {
        color: #fff
      }
    }
  }

</style>
