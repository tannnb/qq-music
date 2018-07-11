import * as types from '../mutation-types'
import {playMode} from "../../api/config";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

const getters = {
  singer: state => state.singer,
  playing: state => state.playing,
  fullScreen: state => state.fullScreen,
  playlist: state => state.playlist,
  sequenceList: state => state.sequenceList,
  mode: state => state.mode,
  currentIndex: state => state.currentIndex,
  currentSong: state => {
    return state.playlist[state.currentIndex]
  }
}


const actions = {
  selectPlay(context, {list,index}) {
    context.commit(types.SET_SEQUENCE_LIST, list)
    context.commit(types.SET_PLAYLIST, list)
    context.commit(types.SET_CURRENTINDEX, index)
    context.commit(types.SET_FULL_SCREEN, true)
    context.commit(types.SET_PLAYING_STATE, true)
  }
}


const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },
  [types.SET_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENTINDEX](state,index){
    state.currentIndex = index
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
