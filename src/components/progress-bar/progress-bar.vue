<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @mousedown.prevent="mousedown">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const progressBtnWidth = 16;
  export default {
    name: '',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },

    created() {
      this.touch = {}
    },
    mounted() {
      this.$nextTick(() => {
        this.bindEvents()
      })
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    },
    methods: {
      //添加绑定事件
      bindEvents(){
        document.addEventListener('mousemove', this.mousemove);
        document.addEventListener('mouseup', this.mouseup);
      },
      //移除绑定事件
      unbindEvents(){
        document.removeEventListener('mousemove',this.mousemove);
        document.removeEventListener('mouseup',this.mouseup);
      },
      mousedown(e) {
        this.touch.initiated = true
        this.touch.startX = e.clientX || e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth
      },
      mousemove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.clientX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      mouseup(e) {
        e.stopPropagation();
        this.touch.initiated = false
        this._triggerPercent()
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      progressClick(e){
        this._offset(e.offsetX)
        this._triggerPercent()
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    beforeDestroy () {
      this.unbindEvents()
    }
  }
</script>

<style scoped lang="stylus">

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, .3);
      cursor pointer
      .progress {
        position: absolute;
        height: 100%;
        background: #fff;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid #fff;
          border-radius: 50%;
          background: #31c27c;
          cursor pointer
        }
      }
    }
  }

</style>
