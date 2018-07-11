<template>
  <div class="review-wrapper">
    <div class="review-header">{{commentheader}}({{commenttotal}})</div>
    <ul class="review-container">
      <li class="items" v-for="(items,index) in commentlist" :key="index">
        <div class="avatar">
          <img :src="items.avatarurl">
        </div>
        <div class="info">
          <div class="nick">{{items.nick}}</div>
          <div class="desc" v-html="items.rootcommentcontent"></div>
          <div class="time">{{items.time | formatDate}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {formatDate} from "../../utils/date";

  export default {
    props: {
      commentheader: {
        type: String,
        default: '最新评论'
      },
      commentlist: {
        type: Array,
        default: []
      },
      commenttotal: {
        type: Number,
        default: ''
      }
    },
    mounted() {
      console.log(this.commentlist)
      console.log(this.commenttotal)
    },
    filters: {
      formatDate(time) {
        let date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .review-wrapper{
    width 100%
    padding-top 60px
  }
  .review-header {
    height: 34px;
    line-height: 34px;
    padding-bottom: 10px;
    border-bottom 1px solid #ededed;
  }

  .review-container {
    .items {
      display flex
      padding 15px 0
      border-bottom 1px solid #ededed;
      .avatar {
        flex 0 0 60
        width 60px
        img {
          width 40px
          height 40px
          overflow hidden
          border-radius 50%
          vertical-align top
        }
      }
      .info {
        flex 1
        .nick {
          color: #999
          font-size 13px
          padding-bottom 6px
        }
        .desc {
          padding-bottom 10px
          font-size 13px
          overflow: hidden;
          word-break: break-all;
          word-wrap: break-word;
          line-height: 24px;
          text-align: justify;
          color: #333
        }
        .time {
          font-size 12px
          color: #999
        }
      }
    }
  }
</style>
