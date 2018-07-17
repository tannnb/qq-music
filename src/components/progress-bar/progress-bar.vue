<template>
  <div class="progress-bar" ref="progressBar" @click.stop="progressClick">
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
  import {mapGetters} from 'vuex'

  const progressBtnWidth = 16;
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        move: {
          status: false,  // 是否可拖动
          startX: 0,      // 记录最开始点击的X坐标
          left: 0,        // 记录当前已经移动的距离
        }
      }
    },
    computed:{
      ...mapGetters(['fullScreen'])
    },
    created() {
      this.touch = {}
    },
    mounted() {
      this.$nextTick(() => {
        this.bindEvents()
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth    // 进度条长度
        const offsetWidth = this.percent * barWidth
        this._offset(offsetWidth)
      })

    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth    // 进度条长度
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
      init(){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth    // 进度条长度
        const offsetWidth = this.percent * barWidth
        this._offset(offsetWidth)
      },
      mousedown(e) {
        // 记录点击的位置
        this.move.status = true;
        this.move.startX = e.clientX
        this.move.left = this.$refs.progress.clientWidth
      },
      mousemove(e) {
        if (!this.move.status) {
          return false
        }
        let endX = e.clientX;
        let dist = endX - this.move.startX;
        let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.move.left + dist));
        this._offset(offsetWidth);
        this._triggerPercent()
      },
      mouseup(e) {
        e.stopPropagation();
        this.move.status = false;
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      progressClick(e){
        let rect = this.$refs.progress.getBoundingClientRect();
        let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,e.clientX - rect.left));
        this._offset(offsetWidth)
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
        background: #31c27c;
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
