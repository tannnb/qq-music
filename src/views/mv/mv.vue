<template>
  <div class="mv-wrapper">
    <div>暂未开发...o(╥﹏╥)o</div>
  </div>
</template>

<script>
  import {getMvlist} from "../../api/mv";

  export default {
    name: "mv",
    data() {
      return {}
    },
    created(){
      this._getMvlist()
    },
    methods: {
      async _getMvlist(){
        try {
          const response = await getMvlist({})
          console.log(response)
        }catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .mv-wrapper {
    text-align center
  }

</style>
