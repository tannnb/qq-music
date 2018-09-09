import * as types from '../mutation-types'
import {playMode} from "../../api/config";
import {shuffle} from "../../utils/util";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  audioVolume: false
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
  },
  audioVolume: state => state.audioVolume,
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

const actions = {
  selectPlay(context, {list, index}) {
    context.commit(types.SET_SEQUENCE_LIST, list)
    if (context.state.mode === playMode.random) {
      let randomList = shuffle(list)
      context.commit(types.SET_PLAYLIST, randomList)
      index = findIndex(randomList, list[index])
    } else {
      context.commit(types.SET_PLAYLIST, list)
    }
    context.commit(types.SET_CURRENTINDEX, index)
    context.commit(types.SET_FULL_SCREEN, true)
    context.commit(types.SET_PLAYING_STATE, true)
  },
  insertSong({commit,state},song){
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex;
    // 若在播放中，则记录当前正在播放的歌曲
    let currentSong = playlist[currentIndex];

    // 将选中的歌曲与播放列表对比，是否存在当前歌曲,并返回其索引
    let fpIndex = findIndex(playlist, song)
    // 插入歌曲到当前播放后面
    currentIndex++;
    playlist.splice(currentIndex, 0, song)

    //存在相同歌曲，将原歌曲删除，新插入的歌曲，往前移动一位
    if (fpIndex > -1) {
      // 判断插入的歌曲，在播放列表中对应歌曲的位置
      if (currentIndex > fpIndex) {
        // 在当前播放歌曲之前
        playlist.splice(fpIndex, 1)
        currentIndex--
      } else {
        playlist.splice(fpIndex + 1, 1)
      }
    }
    let currentSindex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSindex, 0, song)
    if (fsIndex > -1) {
      if (currentSindex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
  }
}


const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_AUDIOVOLUME](state, volume) {
    state.audioVolume = volume
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
