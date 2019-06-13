<template>
  <!--分页组件-->
  <div class="pageComponent" v-if="pageConfig.total">
    <!--上一页-->
    <button @click="prePage" :disabled="currentPage === 1">上一页</button>
    <!--总页数小于8的-->
    <template v-if="pageTotal <= showPageNo">
      <button v-for="i in pageTotal" @click="changeCurrentPage(i)" :class="{active:i === currentPage}" :key="i">{{i}}
      </button>
    </template>
    <template v-else-if="currentPage < 4">
      <button v-for="i in 6" @click="changeCurrentPage(i)" :class="{active:i === currentPage}" :key="i">{{i}}</button>
      <button :disabled="true">···</button>
      <button @click="changeCurrentPage(pageTotal)">{{pageTotal}}</button>
    </template>
    <template v-else-if="currentPage > pageTotal - 4">
      <button @click="changeCurrentPage(1)">1</button>
      <button :disabled="true">···</button>
      <button v-for="i in 6" @click="changeCurrentPage(i + (pageTotal - 6))"
              :class="{active:(i + (pageTotal - 6)) === currentPage}" :key="i">{{i + (pageTotal - 6)}}
      </button>
    </template>
    <template v-else>
      <button @click="changeCurrentPage(1)">1</button>
      <button :disabled="true">···</button>
      <button @click="changeCurrentPage(currentPage - 2)">{{currentPage - 2}}</button>
      <button @click="changeCurrentPage(currentPage - 1)">{{currentPage - 1}}</button>
      <button class="active">{{currentPage}}</button>
      <button @click="changeCurrentPage(currentPage + 1)">{{currentPage + 1}}</button>
      <button @click="changeCurrentPage(currentPage + 2)">{{currentPage + 2}}</button>
      <button :disabled="true">···</button>
      <button @click="changeCurrentPage(pageTotal)">{{pageTotal}}</button>
    </template>
    <!--下一页-->
    <button @click="nextPage" :disabled="currentPage === pageTotal">下一页</button>
  </div>
</template>

<script>
export default {
  name: 'pagination2',
  props: {
    // 分页配置
    pageConfig: {
      type: Object,
      require: true,
      default () {
        return {
          pageSize: 10, // 一页的数据条数
          pageNo: 0, // 当前页的索引
          total: 0, // 总的数据条数
          pageTotal: 0 // 总的页数
        }
      }
    }
  },
  data () {
    return {
      // 默认显示
      showPageNo: 8,
      currentPage: 0
    }
  },
  methods: {
    prePage () {
      this.currentPage -= 1
      this.$emit('changeCurrentPage', this.currentPage)
    },
    nextPage () {
      this.currentPage += 1
      this.$emit('changeCurrentPage', this.currentPage)
    },
    changeCurrentPage (i) {
      if (i === this.currentPage) return
      this.currentPage = i
      this.$emit('changeCurrentPage', this.currentPage)
    },
    setCurrentIndex (i) {
      this.currentPage = i
    }
  },
  computed: {
    // 计算总页数，如果传了pageTotal,直接取pageTotal的值，如果传了total，那么根据pageSize去计算
    pageTotal () {
      const config = this.pageConfig
      if (config.pageTotal) {
        return config.pageTotal
      } else {
        if (config.pageSize && config.total) {
          return Math.ceil(config.total / config.pageSize)
        } else {
          return 0
        }
      }
    }
  },
  created: function () {
    this.currentPage = this.pageConfig.pageNo || 0
  }
}
</script>

<style lang="stylus" scoped>
  .pageComponent {
    button {
      margin: 0 5px;

      color: #a2a2a2;
      outline: none;
      border-radius: 2px;
      padding: 8px 12px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;

      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &:hover {
        background-color: #f4f4f5;
      }

      &.active {
        cursor: not-allowed;
        background-color: #31c27c;
        color: #fff;
      }
    }
  }
</style>
