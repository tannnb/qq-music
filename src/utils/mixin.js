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
    }
  }
}
