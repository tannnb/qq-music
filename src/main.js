import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import CreateAPI from 'vue-create-api'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import comp from '@vue-foldable/baidu'
import IconSvg from './components/svg-icon/svg-nav'
import 'swiper/dist/css/swiper.css'
import 'dplayer/dist/DPlayer.min.css'
import '@vue-foldable/baidu/dist/baidu.css'
import './styles/index.styl'
import './fonts/iconfont'
import VueProgressBar from 'vue-progressbar'
import Loading from './components/loading/loading'
import Toast from './components/Toast/Toast'
import Dialog from './components/confirm/confirm'
import { Tabs,Input,Icon,Affix,Carousel ,Modal,Button,Card,Spin,Tooltip,Pagination,BackTop,Popover,Breadcrumb} from 'ant-design-vue'


Vue.use(Tabs).use(Input).use(Icon).use(Affix).use(Carousel).use(Button).use(Card).use(Spin).use(Tooltip).use(Pagination).use(BackTop).use(Popover).use(Breadcrumb);
Vue.prototype.$confirm = Modal.confirm;


const options = {
  color: '#3f66ff',
  failedColor: '#ff6c33',
  thickness: '1px',
  transition: {
    speed: '0.2s',
    opacity: '0.8s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload)
Vue.component('baidu-foldable', comp)
Vue.component('icon-svg', IconSvg)
Vue.use(CreateAPI, {
  componentPrefix: 'cube-',
  apiPrefix: '$create-'
})
Vue.createAPI(Loading, true)
Vue.createAPI(Toast, true)
Vue.createAPI(Dialog, true)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
