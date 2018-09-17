<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <div v-if="showClose" class="confirm-close"><i @click.stop="close" class="icon-delete"></i></div>
          <span class="confirm-icon"> <i class="icon-important"></i> </span>
          <p class="text">{{text}}</p>
          <div class="operate">
            <div v-if="cancelBtn" @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click.stop="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Dialog',
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      },
      showClose: {
        type: Boolean,
        default: false
      },
      cancelBtn: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      close() {
        this.hide()
      },
      confirm() {
        this.$emit('confirm')
        this.hide()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 100
    overflow hidden
    background-color: rgba(0, 0, 0, 0.43)
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 360px
        background: #fff
        .confirm-close
          padding 10px 4px
          text-align right
          color: #8c8c8c
          i {
            cursor: pointer
            padding 10px
            &:hover {
              color: #31c27c
            }
          }
        .confirm-icon
          display block
          padding 24px 0 18px 0
          text-align center
          i {
            padding 10px
            border-radius 50%
            font-size 30px
            color: #919493
            background #f3f4f5
          }
        .text
          padding: 20px 30px
          line-height: 22px
          text-align: center
          font-size: 14px
          color: #333
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: 14px
          .operate-btn
            flex: 1
            line-height: 30px
            padding: 10px 0
            border-top: 1px solid rgba(204, 204, 204, 0.67)
            color: #31c27c
            cursor pointer
            &.left
              border-right: 1px solid rgba(204, 204, 204, 0.8)
              color: #494949

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
