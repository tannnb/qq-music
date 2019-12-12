<template>
    <a-back-top :visibilityHeight="visibilityHeight" />
</template>

<script>
export default {
  name: 'backTop',
  data () {
    return {
      timer: null,
      istop: true,
      visibilityHeight:300
    }
  },
  mounted () {
   // window.addEventListener('scroll', this.userScroll)
  },
  destroyed () {
   // window.removeEventListener('scroll', this.userScroll)
  },
  methods: {
    userScroll () {
      let oTop = document.documentElement.scrollTop || document.body.scrollTop
      let oHeight = document.documentElement.clientHeight || document.body.clientHeight
      let Obtn = this.$refs.btn
      if (oTop >= oHeight) {
        Obtn.style.display = 'block'
      } else {
        Obtn.style.display = 'none'
      }
      if (this.istop) {
        clearInterval(this.timer)
      }
      this.istop = true
    },
    backTop () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let oTop = document.documentElement.scrollTop || document.body.scrollTop
        let ispeed = Math.floor(-oTop / 6)
        document.documentElement.scrollTop = document.body.scrollTop = oTop + ispeed
        this.istop = false
        if (oTop === 0) {
          clearInterval(this.timer)
        }
      }, 30)
    }
  }
}
</script>
<style>
    .ant-back-top {
        bottom: 80px;
        right: 60px;
    }
</style>
<style lang="stylus" scoped>
    #components-back-top-demo-custom .ant-back-top {
        bottom: 100px;
    }
    #components-back-top-demo-custom .ant-back-top-inner {
        height: 40px;
        width: 40px;
        line-height: 40px;
        border-radius: 4px;
        background-color: #1088e9;
        color: #fff;
        text-align: center;
        font-size: 20px;
    }
</style>
