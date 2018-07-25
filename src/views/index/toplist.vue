<template>
  <div class="toplist-container">
    <div class="title">排行榜
      <a href="javascript:void(0)">更多></a>
    </div>

    <div class="toplist-main">
      <div class="listItem" v-for="(items,index) in toplistData" :key="index">
        <div class="item">
            <div class="toplistTitle">巅峰榜</div>
            <div class="toplistName"> {{_padd(items.name)}}</div>
            <div class="line"></div>
            <ul class="subItemWrapper">
              <li class="subItme"
                  v-for="(sub,index) in items.songlist"
                    @click="handleSelectItem(sub)"
                  :key="index">
                <p class="singername"> {{index+1}}  {{sub.singer_name}}</p>
                <p class="trackname">{{sub.track_name}}</p>
              </li>
            </ul>
        </div>
        <div class="bg" :class="`bg_${index}`"></div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "toplist",
    props: {
      toplist: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        toplistData: []
      }
    },
    created() {
      this.toplistData = this.toplist.group_list[0].list.slice(0, 5)
    },
    methods:{
      _padd(item){
        return item.split('·')[1]
      },
      handleSelectItem(sub){
        console.log(sub)
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .toplist-container
    background: linear-gradient(#f3f3f3, #fff)
    padding-bottom 30px
    .title {
      position: relative
      width 1200px
      margin 0 auto
      padding 50px 0 24px 0
      line-height 40px
      font-size 30px
      text-align center
      color: #545454
      letter-spacing 6px
      font-weight bold
      a {
        position: absolute
        top: 52px
        right 0
        font-size 14px
        color: #333
        letter-spacing: 2px;
        cursor pointer
        &:hover {
          color: #31c27c
        }
      }
    }

    .toplist-main {
      display flex
      justify-content space-between
      width 1200px
      height 500px
      margin 0 auto
      background: #efefef;
      .listItem {
        position relative
        overflow hidden
        width 224px
        overflow hidden
        &:hover{
          .bg{
            transform scale(1.2)
          }
        }
        .item{
          position absolute
          z-index 3
          top: 0
          left: 0
          bottom 0
          width 100%
          color: #fff
          cursor pointer
          &:hover{
            .line{
              width 70px
            }
          }
          .toplistTitle{
            padding-top  60px
            padding-bottom 10px
            font-size 18px
            text-align center
          }
          .toplistName{
            font-size 24px
            text-align center
          }
          .line{
            width 30px
            height:2px
            background #fff
            margin 30px auto 20px auto
            transition all .2s
          }
          .subItemWrapper{
            padding 30px
          }
          .subItme{
            padding-bottom 20px
            .singername{
              padding-bottom 8px
              font-size 16px
            }
            .trackname{
              padding-bottom 6px
              padding-left 14px
              font-size 10px
            }
          }
        }
        .bg {
          position: absolute
          top: 0
          z-index 0
          width 224px
          height: 100%
          transition all .2s
          &.bg_0{
            background: url("./toplist.png") 100% 100%;
            background-position 0 0
          }
          &.bg_1{
            background: url("./toplist.png") 100% 100%;
            background-position -224px 0
          }
          &.bg_2{
            background: url("./toplist.png") 100% 100%;
            background-position -448px 0
          }
          &.bg_3{
            background: url("./toplist.png") 100% 100%;
            background-position -672px 0
          }
          &.bg_4{
            background: url("./toplist.png") 100% 100%;
            background-position -896px 0
          }
        }
      }
    }


</style>
