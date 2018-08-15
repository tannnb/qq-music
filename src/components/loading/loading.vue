<template>
  <div class="loadingWrapper" v-show="showFlag">
    <div class="loading">
      <img src="../../images/loading.gif" alt="">
      <p>玩命加载中...</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    data(){
      return {
        showFlag:true
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide(){
        this.showFlag = false
        console.log('执行')
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .loadingWrapper {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    margin auto
    background white
    .loading {
      position: absolute
      top: 50%
      left: 50%
      transform translate(-50%, -50%)
      text-align center
      img {
        vertical-align top
      }
      p {
        padding-top 20px
        color: #31c27c
        font-size 18px
      }
    }
  }


</style>
