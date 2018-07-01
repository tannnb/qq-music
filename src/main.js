// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import IconSvg from './components/svg-icon/svg-nav'
import 'swiper/dist/css/swiper.css'
import  './styles/index.styl'
import './fonts/iconfont'
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload)
Vue.component('icon-svg', IconSvg)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
