<template>
  <div class="loading">
    <img width="60" height="60" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 60px
      font-size: 18px
      color: #313131
</style>
