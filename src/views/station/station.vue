<template>
  <div class="stationWrapper">
    <div v-if="stationList" v-for="(items,index) in stationList.groupList">
      <h4>{{items.name}}</h4>
      <ul>
        <li v-for="(item,index) in items.radioList">
          <img :src="item.radioImg" alt="">
          <p>{{item.radioName}}</p>
          <p>{{item.listenNum}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  import {station} from "../../api/radio";
  import {ERR_OK} from "../../api/config";

  export default {
    name: "station",
    data(){
      return {
        stationList:null
      }
    },
    created() {
      this._station()
    },
    methods: {
      _station() {
        station().then(res => {
          let ret = res.data
          const reg = /^\w+\(({.+})/
          const matches = ret.match(reg)
          if (matches) {
            ret = JSON.parse(matches[1] + '}')
          }
          if (ret.code === ERR_OK){
            this.stationList = ret.data.data
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
