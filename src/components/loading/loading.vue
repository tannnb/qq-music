<template>
  <transition name="fade">
    <div class="loadingWrapper" v-show="showFlag">
      <span @click.stop="LoadingCloseEvent" class="close"><i class="icon-delete"></i>关闭</span>
      <div class="loading">
        <img src="../../images/loading.gif" alt="">
        <p>{{content}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "loading",
    props: {
      content: {
        type: String,
        default: '玩命加载中...'
      }
    },
    data() {
      return {
        showFlag: true
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
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      LoadingCloseEvent() {
        this.hide()
      }
    }
  }
</script>

<style lang="stylus">
  .hidden
    overflow hidden
  .loadingWrapper
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    margin auto
    z-index 100
    background white
    overflow hidden
    &.fade-enter-active, &.fade-leave-active
      transition all 0.3s
    &.fade-enter, &.fade-leave-to
      opacity 0
    .close
      position: absolute
      top: 20px
      right: 30px
      display inline-block
      padding 6px 10px
      font-size 14px
      color: #c2c2c2
      border: 1px solid #c2c2c2
      border-radius 20px
      cursor: pointer
      &:hover
        color: #31c27c
        border-color: #31c27c
    .loading
      position: absolute
      top: 50%
      left: 50%
      bottom: auto
      transform translate(-50%, -50%)
      text-align center
      img
        vertical-align top
      p
        padding-top 20px
        color: #31c27c
        font-size 18px
</style>
