export const LoadingMixin = {
  methods: {
    CreateLoading (message) {
      return this.$createLoading({
        $props: {
          content: message,
        },
      }).show()
    },
    CreateToast (message) {
      return this.$createToast({
        $props: {
          content: message,
        },
      }).show()
    },
    CreateDialog (options) {
      return this.$createDialog({
        $props: {
          text: options.message,
          confirmBtnText: options.confirmBtnText,
          cancelBtnText: options.cancelBtnText,
          showClose: options.showClose,
          cancelBtn: options.cancelBtn,
        },
        $events: {
          confirm () {
            options.confirmBtn && options.confirmBtn()
          },
          close () {
            options.close && options.close()
          },
        },
      }).show()
    },
  },
}

export const PaginationMixin = {
  methods: {
    _initPagination (total) {
      if (!total) throw 'argument is not undefined'
      return {
        pageSize: 10,     //一页的数据条数
        pageNo: 1,        //当前页的索引
        total: total,     //总的数据条数
      }
    },
  },
}
