<template>
  <ul class="pagination">
    <li v-show="current != 1" @click="current-- && goto(current)">  <a href="javascript:void(0)" class="icon-Pageprev"></a>  </li>
    <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
      <a href="javascript:void(0)">{{index}}</a>
    </li>
    <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"> <a href="javascript:void(0)" class="icon-Pagenext"></a> </li>
  </ul>
</template>

<script>
  export default {
    name: "pagination",
    props:{
      allpage:{
        type:Number,
        default:0
      }
    },
    data: function () {
      return {
        current: 1,
        showItem: 8
      }
    },
    computed: {
      pages: function () {
        var pag = [];
        if (this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
          //总页数和要显示的条数那个大就显示多少条
          var i = Math.min(this.showItem, this.allpage);
          while (i) {
            pag.unshift(i--);
          }
        } else { //当前页数大于显示页数了
          var middle = this.current - Math.floor(this.showItem / 2),//从哪里开始
            i = this.showItem;
          if (middle > (this.allpage - this.showItem)) {
            middle = (this.allpage - this.showItem) + 1
          }
          while (i--) {
            pag.push(middle++);
          }
        }
        return pag
      }
    },
    methods: {
      goto: function (index) {
        if (index == this.current) return;
        this.current = index;
        this.$emit('pagetions',index)
      },
      setCurrent(current){
        this.current = current
      }
    }
  }
</script>

<style lang="stylus" scoped>

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  .pagination {
    position: relative;
    margin 0 auto
  }

  .pagination li {
    display: inline-block;
    margin: 0 5px;
  }

  .pagination li a {
    padding:  0.8rem 1rem;
    display: inline-block;
    border: 1px solid transparent;
    font-size 14px
    background: #fff;
    color: #a2a2a2;
  }

  .pagination li a:hover {
    background: #eee;
  }

  .pagination li.active a {
    background: #31c27c;
    color: #fff;
  }

</style>
