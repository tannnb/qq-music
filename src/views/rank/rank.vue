<template>
  <div class="rankWrapper">
    <div class="rank-main">
      <div class="slider">
        <ul @click.stop class="slider-items" clas v-for="(items,index) in listOpt" :key="items.GroupID">
          <span class="title">{{items.GroupName}}</span>
          <li class="item"
              v-for="(item,index) in items.List"
              :class="currentIndex === item.topID? 'active':''  "
              @click.stop="handleSelectSlider(item.topID)"
              :key="item.topID"> {{item.ListName}}</li>
        </ul>
      </div>
      <div class="rankContent">
        sdf
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
  import {toplistOpt} from '../../api/rank'
  import {ERR_OK} from "../../api/config";

  export default {
    name: "rank",
    data() {
      return {
        listOpt: [],
        currentIndex:0
      }
    },
    created() {
      this._toplistOpt()
    },
    methods: {
      _toplistOpt() {
        toplistOpt().then(res => {
          let ret = res.data.trim()
          var result = ret.replace(/\n/g, "");
          const matches = result.replace(/^\w+\(/, '')
          const str = matches.replace(/\)$/, '')
          this.listOpt = JSON.parse(str)
          console.log(this.listOpt)
        })
          .catch(err => {
            console.log(err)
          })
      },
      handleSelectSlider(id){
        console.log(id)
       this.currentIndex = id
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .rankWrapper {
    padding-top 35px
    background: linear-gradient(#f3f3f3, #fff);
    .rank-main {
      display flex
      width 1200px
      margin 0 auto
      .slider {
        flex 0 0 150
        width 150px
        border:1px solid rgba(153,153,153,.2)
        .slider-items{
          .title{
            display block
            line-height: 60px;
            font-size: 20px;
            font-weight: 400;
            font-size 15px
            text-align center
            border-bottom: 1px solid #ebebeb;
            margin: 0 17px 10px;
          }
          .item{
            display: block;
            text-align center
            line-height: 22px;
            padding: 8px 17px;
            font-size 14px
            cursor pointer
            &:hover{
              color: #31c27c
            }
            &.active{
              color: #fff
              background: #31c27c
            }
          }
        }
      }
      .rankContent {
        flex 1
      }
    }
  }

</style>
