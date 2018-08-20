<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>

    <Player></Player>



    <a href="javascript:void(0)" ref="btn" @click="backTop" class="btn" title="回到顶部"></a>
  </div>
</template>

<script>
  import Player from './views/player/player'
  import {mapGetters} from 'vuex'

  export default {
    name: 'App',
    data() {
      return {
        timer: null,
        istop: true
      }
    },
    components: {
      Player
    },
    computed: {
      ...mapGetters(['fullScreen'])
    },
    watch: {
      fullScreen(newValue) {
        let abody = document.getElementsByTagName('body')[0]
        if (newValue == true) {
          this.$nextTick(() => {
            if (this.fullScreen) {
              abody.classList.add('noneScorllY')
            }
          })
        } else {
          abody.classList.remove('noneScorllY')
        }
      }
    },
    created() {

    },
    mounted() {
      window.addEventListener('scroll', this.userScroll);
      let OriginTitile = document.title, titleTime;
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          document.title = '大佬欢迎下次再来！';
          clearTimeout(titleTime);
        } else {
          document.title = '勇士，你来啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄!';
          titleTime = setTimeout(function () {
            document.title = OriginTitile;
          }, 2000);
        }
      });
    },
    methods: {
      userScroll() {
        let oTop = document.documentElement.scrollTop || document.body.scrollTop;
        let oHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let Obtn = this.$refs.btn
        if (oTop >= oHeight) {
          Obtn.style.display = "block";
        } else {
          Obtn.style.display = "none"
        }
        if (this.istop) {
          clearInterval(this.timer)
        }
        this.istop = true;
      },
      backTop() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          let oTop = document.documentElement.scrollTop || document.body.scrollTop;
          let ispeed = Math.floor(-oTop / 6);
          document.documentElement.scrollTop = document.body.scrollTop = oTop + ispeed;
          this.istop = false;
          if (oTop == 0) {
            clearInterval(this.timer)
          }
        }, 30)
      }
    }
  }
</script>
<style lang="stylus">

  body {
    overflow-x hidden
  }

  .noneScorllY {
    overflow-y hidden
  }

  .paddingBtoom {
    padding-bottom 100px
  }

  .btn {
    width: 40px;
    height: 40px;
    position: fixed;
    right: 65px;
    bottom: 60px;
    display: none;
    background: url("./images/top_bg.png") no-repeat left top;
  }

  .btn:hover {
    background: url("./images/top_bg.png") no-repeat 0 -39px;
  }


</style>
