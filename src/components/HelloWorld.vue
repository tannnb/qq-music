<template>
  <div>
    <button @click="increase">增加</button>
  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  import {getRecommend} from '../api/recommend'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed:{
      ...mapGetters(['count'])
    },
    methods: {
      ...mapActions(['increaseCount']),
      increase() {
        getRecommend().then(res => {
          console.log(res)
        })
        //this.increaseCount(ret)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
