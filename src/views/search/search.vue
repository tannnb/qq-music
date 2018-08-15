<template>
  <div class="search-wrapper">

    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="searchFn">
        <input class="oInput" type="text">
        <i class="icon-search"></i>
      </div>
      <div class="hotSearch"> 热门搜索:
        <a v-for="(items,index) in hotKey" :key="items.n">{{items.k}}</a>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {gethotkey} from "../../api/recommend";
  import {ERR_OK} from "../../api/config";

  export default {
    name: "search",
    data(){
      return {
        hotKey:''
      }
    },
    created() {
      this._gethotkey()
      console.log(this.$route.query)
    },
    computed: {
      ...mapGetters(['searchHistory']),
    },
    methods:{
      _gethotkey() {
        gethotkey().then(res => {
          if (res.code === ERR_OK) {
            this.hotKey = this._normal(res.data.hotkey)
          }
        })
      },
      _normal(item) {
        return item.slice(0, 5)
      },
    }
  }
</script>

<style lang="stylus" scoped>

  .search-wrapper {
    width 100%
    height 247px
  }

  .search-area {
    position: relative
    width 100%
    height 247px
    background url("./bg_search.jpg")
    background-size cover
    .searchFn {
      position absolute
      top: 85px
      left: 50%
      transform translateX(-50%)
      width 640px
      height: 50px
      border-radius 3px
      background white
      overflow hidden
      .oInput {
        border: none
        line-height 50px
        width 90%
        padding 0 10px
        font-size 15px
        color: #000
        outline none
      }
      .icon-search {
        position: absolute
        right: 0
        top: 50%
        transform translateY(-50%)
        font-size 24px
        padding 12px
        color: #989898
        vertical-align middle
      }
    }
    .hotSearch {
      position absolute
      top: 155px
      left: 50%
      transform translateX(-50%)
      color: #fff
      a{
        display inline-block
        font-size 14px
        margin-left 16px
        color: #fff
        cursor pointer
        &:hover{
          text-decoration underline
        }
      }
    }
  }

</style>
