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
              margin 0 10px 10px 0
              padding 4px 12px
              color #333
              border-radius: 19px
              font-size 14px
              cursor pointer
              margin-right 4px
              border: 1px solid transparent
              &:hover
                  box-sizing border-box
                  background: #fafbff;
                  border: 1px solid #eee;
                  box-shadow: 0 5px 6px 0 rgba(217, 219, 227, .22), 0 3px 1px 0 rgba(250, 251, 255, .1)
                  color #3b426b

              &:first-child
                  font-size 15px

              &.active
                  border: 1px solid #2a62ff;
                  background: linear-gradient(0deg, #2a62ff, #4e7dff);
                  box-shadow: 0 5px 6px 0 rgba(73, 105, 230, .22);
                  color: #fff
</style>
