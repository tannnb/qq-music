<template>
    <div class="subHeader">
        <ul class="subTitle" v-if="navList.length">
            <li v-for="(items,index) in navList"
                :key="index"
                @click="handleSelectItem(index,items)"
                :class="index === currentIndex? 'active':'' ">
                <a-icon v-if="index === currentIndex" type="fire"/>
                {{items.text}}
            </li>
        </ul>
        <div class="more" @click="handleMore">
            <a-button type="primary" icon="reload" :ghost="true">换一批</a-button>
        </div>
    </div>
</template>

<script>
  import { shuffle } from '@/utils/util'

  export default {
    name: 'music-subHeader',
    props: {
      content: {
        type: Object,
        default: () => {
        },
      },
      currentIndex: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        navList:[]
      }
    },
    created () {
      this._initRecommend()
    },
    methods: {
      _initRecommend() {
        let first = this.content.firstRecommend ? this.content.firstRecommend : null
        let list
        list = shuffle(this.content.navList).splice(0, 5)
        this.navList = [first, ...list]
      },
      handleSelectItem (index, items) {
        this.$emit('handleSelectItem', index, items)
      },
      handleMore() {
        this._initRecommend()
      }
    },
  }
</script>
<style lang="stylus">
    .subHeader{
        .ant-btn{
            border-radius 30px !important
        }
    }
</style>
<style lang="stylus" scoped>
    .subHeader
        display flex
        width 1200px
        margin 20px auto

        .subTitle
            flex 1
            display: flex
            align-items center

            li
                font-size 13px
                margin: 0px 30px 0px 0
                color: #999
                cursor pointer

                &:hover
                    color: rgb(63, 102, 255)

                &.active
                    color: rgb(63, 102, 255)

        .more {
            display flex
            justify-items center
            justify-self center
            justify-content center
            width 100px
            color: #999
            cursor pointer
            font-size:13px
            &:hover {
                color: rgb(63, 102, 255)
            }
            .icon {
                font-size:15px
                padding-right 20px
            }
        }
</style>
