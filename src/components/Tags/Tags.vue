<template>
  <div class="tag-wrapper">
    <div v-if='titleName' class="titleName">{{titleName}}</div>
    <ul class="content">
      <li class="item" v-for="items in tag"
          :class="currentId=== items.id? 'active':'' "
          :key="items.id"
          @click="selectItem(items)">{{items.title}}
      </li>
    </ul>
  </div>

</template>

<script>
  export default {
    props: {
      tag: {
        type: Array,
        default: []
      },
      currentId: {
        type: Number,
        default: 0
      },
      titleName: {
        type: String,
        default: ''
      }
    },
    methods: {
      selectItem(items) {
        this.$emit('selectItemTag', items)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .tag-wrapper
    position: relative;
    .titleName
      position absolute
      top: 0
      left: 0
      display inline-block
      height 26px
      line-height 27px
      font-size 14px
    .content
      padding-left 60px
      .item
        display inline-block
        height 26px
        line-height 27px
        padding 0 8px
        margin 0 14px 14px 0
        color #333
        font-size 14px
        cursor pointer
        &:hover
          background #31c27c
          color #fff
        &:first-child
          font-size 15px
        &.active
          background #31c27c
          color: #fff
</style>
