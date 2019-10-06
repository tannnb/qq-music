<template>
    <a href="javascript:void(0)" ref="btn" @click="backTop" class="btn" title="回到顶部"></a>
</template>

<script>
export default {
  name: 'backTop',
  data () {
    return {
      timer: null,
      istop: true
    }
  },
  mounted () {
    window.addEventListener('scroll', this.userScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.userScroll)
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

<style lang="stylus" scoped>
    .btn {
        width: 60px;
        height: 60px;
        position: fixed;
        right: 65px;
        bottom: 80px;
        display: none;
        background: url("./top_bg.png") no-repeat left top;
    }
    .btn:hover {
        background: url("./top_bg.png") no-repeat 0 -60px;
    }
</style>
