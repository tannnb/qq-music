<template>
  <div class="subHeader">
    <div class="title">{{datas.title}}</div>
    <ul class="subTitle">
      <li
        v-for="(items,index) in datas.navList"
        @click="handleSelectNewSong(index,items)"
        data-type="items.type"
        :class=" index === currentIndex? 'active':'' "
        :key="index">{{items.text}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "m-title",
    props: {
      datas: {
        type: Object,
        default: {}
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      handleSelectNewSong(index, item) {
        this.$emit('handleSelectEvent', index, item)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .subHeader {
    width 1200px
    margin 0 auto
    .title {
      padding 50px 0 24px 0
      line-height 40px
      text-align center
      font-size 30px
      color: #545454
      letter-spacing 6px
      font-weight bold
    }
    .subTitle {
      display: flex
      justify-content center
      align-items center
      li {
        line-height 22px
        font-size 15px
        margin 0 24px
        padding-bottom 40px
        color: #333
        cursor pointer
        &:hover {
          color: #31c27c
        }
        &.active {
          color: #31c27c
        }
      }
    }
  }

</style>
