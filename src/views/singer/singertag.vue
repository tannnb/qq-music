<template>
  <ul class="singer_index">
    <li class="item"
        v-for="(items,index) in tag"
        :class="currentIndex===index? 'active':'' "
        :key="index"
        @click="selectItem(items,index)"
    >{{items.name}}
    </li>
  </ul>
</template>

<script>
  export default {
    name: "singertag",
    props: {
      tag: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(items, index) {
        this.$emit('selectItemTag', items, index)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .singer_index {
    display flex
    .item {
      height: 26px;
      line-height: 27px;
      overflow: hidden;
      padding: 0 8px;
      margin: 0 12px 14px 0;
      color: #333
      font-size 14px
      cursor pointer
      &:hover {
        background: #31c27c
        color: #fff
      }
      &:first-child {
        font-size 15px
      }
      &.active {
        background: #31c27c
        color: #fff
      }
    }
  }


</style>
