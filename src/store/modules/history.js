import * as types from '../mutation-types'
import {
  saveSearch,
  clearSearch,
  deleteSearch,
  loadSearch,
  saveSingId,
  loadSingId,
  saveFavorite,
  deleteFavorite,
  loadFavorite
} from '../../utils/ceche'



const state = {
  initSearchHistory: loadSearch(),
  initMid: loadSingId(),
  favoriteList: loadFavorite()
}

const getters = {
  searchHistory: state => state.initSearchHistory,
  mid: state => state.initMid,
  favoriteList: state => state.favoriteList
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
  },
  saveFavoriteList({commit},song){
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
  },
  deleteFavoriteList({commit},song){
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
  }
}


const mutations = {
  [types.SET_SEARCH_HISTORY](state, payload) {
    state.initSearchHistory = payload
  },
  [types.SAVE_SINGID](state, payload) {
    state.initMid = payload
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
