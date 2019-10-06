import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import history from './modules/history'
import disc from './modules/disc'
import player from './modules/player'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    history,
    disc,
    player
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
