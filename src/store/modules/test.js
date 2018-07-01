import * as types from '../mutation-types'

const state = {
  count: 0
}

const getters = {
  count:state => state.count
}


const actions = {
  increaseCount(context,payload){
    context.commit('MUSIC_TEST',payload)
  }
}


const mutations = {
  [types.MUSIC_TEST](state,payload) {
    state.count = payload
  }
}



export default {
  state,
  getters,
  actions,
  mutations
}
