import * as types from '../mutation-types'

const state = {
  initDisc: {}
}

const getters = {
  initDisc:state => state.initDisc
}


const actions = {
  saveDiscInfo(context,payload){
    context.commit('SET_DISC_INFO',payload)
  }
}


const mutations = {
  [types.SET_DISC_INFO](state,payload) {
    state.initDisc = payload
  }
}



export default {
  state,
  getters,
  actions,
  mutations
}
