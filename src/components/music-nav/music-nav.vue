<template>
  <div class="music-nav">
    <ul class="select-container">
      <router-link
        tag="li"
        :key="index"
        v-for="(items,index) in navData"
        @click="handleNavSelect(index)"
        class="navItem" :to="items.url"><span>{{items.label}}</span></router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "music-nav",
    data() {
      return {
        navData:[
          {
            label:'首页',
            url:'/Music'
          },
          {
            label:'歌手',
            url:'/singer'
          },
          {
            label:'专辑',
            url:'/album'
          },
          {
            label:'排行榜',
            url:'/rank'
          },
          {
            label:'分类歌单',
            url:'/sort'
          },
          {
            label:'电台',
            url:'/station'
          },
          {
            label:'数字专辑',
            url:'/digitalalbum'
          },
          {
            label:'MV',
            url:'/mv'
          }
        ]
      }
    },
    methods: {
      handleNavSelect(index) {
        this.$emit('handleNavSelect', index)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .music-nav {
    width 1200px
    margin 0 auto

    .select-container {
      display flex
      justify-content center
    }
    .router-link-active {
      span {
        color #31c27c
      }
    }
    .navItem {
      display inline-block
      padding 0 20px
      line-height 50px
      font-size 14px
      color: #5c5c5c
      cursor pointer
      &:hover {
        color #31c27c
      }
    }
  }


</style>
