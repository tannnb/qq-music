export const LoadingMixin = {
  methods: {
    CreateLoading(message){
      return this.$createLoading({
        $props: {
          content:message
        },
      }).show()
    },
    CreateToast(message){
      return this.$createToast({
        $props: {
          content:message
        }
      }).show()
    },
    CreateDialog(options){
      return this.$createDialog({
        $props: {
          text:options.message,
          confirmBtnText:options.confirmBtnText,
          cancelBtnText:options.cancelBtnText,
          showClose:options.showClose,
          cancelBtn:options.cancelBtn
        },
        $events:{
          confirm(){
            options.confirmBtn && options.confirmBtn()
          }
        }
      }).show()
    }
  }
}
