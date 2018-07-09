import * as types from '../mutation-types'
import {
  saveSearch,
  clearSearch,
  deleteSearch,
  loadSearch,
  saveSingId,
  loadSingId
} from '../../utils/ceche'
import storage from "good-storage";


const state = {
  initSearchHistory: loadSearch(),
  initMid: loadSingId()
}

const getters = {
  searchHistory: state => state.initSearchHistory,
  mid: state => state.initMid
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
  deleteSearchHistory({commit}, song) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(song))
  },
  // 保存id/mid
  saveSingID({commit}, id) {
    commit(types.SAVE_SINGID, saveSingId(id))
  }

}


const mutations = {
  [types.SET_SEARCH_HISTORY](state, payload) {
    state.initSearchHistory = payload
  },
  [types.SAVE_SINGID](state, payload) {
    state.initMid = payload
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
