<template>
  <div class="loading" v-show="showFlag">
    <div class="loading-content">
      <img width="30" height="30" src="./loading.gif">
      <span class="desc">{{content}}</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name:'Toast',
    props: {
      content: {
        type: String,
        default: '加载中...'
      }
    },
    data(){
      return {
        showFlag:false
      }
    },
    watch:{
      showFlag(newValue,oldValue){
        const body = document.querySelector('body')
        if(newValue === true){
          body.classList.add('hidden')
        }else{
          body.classList.remove('hidden')
        }
      }
    },
    methods:{
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .hidden
    overflow hidden
    padding-right 5px
  .loading
    position: fixed
    top 0
    bottom 0
    left 0
    right 0
    margin 0 auto
    z-index 100
    overflow hidden
    .loading-content
      display flex
      justify-content center
      align-items center
      position: absolute
      top 50%
      left 50%
      padding 0 20px
      transform translate(-50%,-50%)
      background rgba(37,38,45,.9)
     img
      vertical-align top
    .desc
      line-height: 60px
      font-size: 16px
      padding-left 8px
      color: rgb(194,194,194)
</style>
