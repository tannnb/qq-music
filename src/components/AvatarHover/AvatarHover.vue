<template>
  <div class="avatar-wrapper">
    <div class="img-cover"><img v-lazy="avatarUri" /></div>
    <div class="mark-cover"></div>
  </div>
</template>

<script>
  export default {
    name: "AvatarHover",
    props:{
      avatarUri:{
        type:String,
        default: require('./playlist_300.png')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .avatar-wrapper
    position relative
    width 100%
    height: 100%
    overflow hidden
    cursor pointer
    .img-cover
      img
        width 100%
        height 100%
        vertical-align top
        transition all .4s
    .mark-cover
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      opacity 0
      z-index 2
      background rgba(0, 0, 0, 0.2) url("cover_play.png") no-repeat center center
      background-size 35px 35px
      transition all .4s
    &:hover
      .mark-cover
        opacity 1
        background rgba(0, 0, 0, 0.2) url("cover_play.png") no-repeat center center
        background-size 70px 70px
      .img-cover
        img
          transform scale(1.08)
</style>
