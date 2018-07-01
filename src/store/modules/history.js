import * as types from '../mutation-types'
import {saveSearch, clearSearch,deleteSearch, loadSearch} from '../../utils/ceche'


const state = {
  initHistory: {
    searchHistory: loadSearch()
  }
}

const getters = {
  searchHistory: state => state.initHistory.searchHistory
}


const actions = {
  // 保存点击历史
  saveSearcHistory({commit}, search) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(search))
  },
  // 清除点击历史记录
  clearSearchHistory({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
  },
  // 删除单条信息
  deleteSearchHistory({commit},song){
    commit(types.SET_SEARCH_HISTORY, deleteSearch(song))
  }
}


const mutations = {
  [types.SET_SEARCH_HISTORY](state, payload) {
    state.initHistory.searchHistory = payload
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
