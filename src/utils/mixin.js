export const LoadingMixin = {
  methods: {
    CreateLoading(message){
      return this.$createLoading({
        $props: {
          content:message
        },
      }).show()
    }
  }
}
