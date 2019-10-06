<template>
    <ul class="singer_index">
        <li class="item" v-for="(items,index) in tagSource"
            :class="activeIndex===index? 'active':'' "
            :key="index"
            @click="selectItem(items,index)">{{items.name}}
        </li>
    </ul>
</template>

<script>
export default {
  name: 'checkTag',
  props: {
    tagSource: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeIndex: this.currentIndex
    }
  },
  methods: {
    selectItem (items, index) {
      this.activeIndex = index
      this.$emit('selectItemTag', items, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
    .singer_index
        display flex
        margin 10px 0
        .item
            padding 4px 12px
            color #333
            border-radius: 19px
            font-size 14px
            cursor pointer
            margin-right 4px
            border:1px solid transparent;

            &:hover
                box-sizing border-box
                background: #fafbff;
                border: 1px solid #eee;
                box-shadow: 0 5px 6px 0 rgba(217,219,227,.22), 0 3px 1px 0 rgba(250,251,255,.1);;
                color #3b426b
            &:first-child
                font-size 12px
            &.active
                border: 1px solid #2a62ff;
                background: linear-gradient(0deg,#2a62ff,#4e7dff);
                box-shadow: 0 5px 6px 0 rgba(73,105,230,.22);
                color: #fff
</style>
