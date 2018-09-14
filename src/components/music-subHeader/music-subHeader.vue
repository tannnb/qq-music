<template>
  <div class="subHeader">
    <div class="title" v-if="content.title">{{content.title}}</div>
    <ul class="subTitle" v-if="navList.length">
      <li v-for="(items,index) in navList"
          :key="index"
          @click="handleSelectItem(index,items)"
          :class=" index === currentIndex? 'active':'' ">{{items.text}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {shuffle} from "../../utils/util"
  export default {
    name: "music-subHeader",
    props: {
      content: {
        type: Object,
        default: () => {
        }
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    created() {
      let first = this.content.firstRecommend ? this.content.firstRecommend : null
      let list
      if (first !== null) {
        list = shuffle(this.content.navList).splice(0, 5)
      }
      this.navList = [first, ...list]
    },
    methods: {
      handleSelectItem(index, items) {
        this.$emit('handleSelectItem', index, items)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .subHeader
    width 1200px
    margin 0 auto
    .title
      padding 50px 0 24px 0
      line-height 40px
      text-align center
      font-size 30px
      color: #545454
      letter-spacing 6px
      font-weight bold
    .subTitle
      display: flex
      justify-content center
      align-items center
      li
        line-height 22px
        font-size 15px
        margin 0 24px
        padding-bottom 40px
        color: #333
        cursor pointer
        &:hover
          color: #31c27c
        &.active
          color: #31c27c
</style>
