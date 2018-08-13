<template>
  <div class="rank">
    <div>暂未开发...o(╥﹏╥)o</div>
  </div>
</template>

<script>
  import {toplistOpt} from '../../api/rank'
  import {ERR_OK} from "../../api/config";

  export default {
    name: "rank",
    data() {
      return {
        listOpt: []
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
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .rank {
    text-align center
  }

</style>
