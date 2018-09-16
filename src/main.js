// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import CreateAPI from 'vue-create-api'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import IconSvg from './components/svg-icon/svg-nav'
import 'swiper/dist/css/swiper.css'
import  './styles/index.styl'
import './fonts/iconfont'
import VueProgressBar from 'vue-progressbar'
import Loading from './components/loading/loading'
import Toast from './components/Toast/Toast'


const options = {
  color: '#31c27c',
  failedColor: '#874b4b',
  thickness: '4px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(VueAwesomeSwiper)

Vue.use(VueLazyload)

Vue.component('icon-svg', IconSvg)

Vue.use(CreateAPI, {
  componentPrefix: 'cube-',
  apiPrefix: '$create-'
})
Vue.createAPI(Loading, true)
Vue.createAPI(Toast, true)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
