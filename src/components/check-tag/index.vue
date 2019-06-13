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
      console.log(items)
      this.$emit('selectItemTag', items, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
    .singer_index
        display flex

        .item
            position: relative;
            z-index: 1;
            height 26px
            line-height 27px
            overflow hidden
            padding 0 8px
            margin 0 12px 14px 0
            color #333
            font-size 14px
            cursor pointer

            &::before
                content: '';
                position: absolute;
                z-index: -1;
                top: 0;
                bottom: 0;
                left: -0.25em;
                right: -0.25em;
                transform-origin: bottom center;
                transform: scaleY(0.1);
                transition: all 0.2s ease-in-out;

            &:hover
                color white
                &::before
                    transform: scaleY(1);
                    background-color: #31c27c;

            &:first-child
                font-size 15px

            &.active
                background #31c27c
                color: #fff
</style>
