import Vue from 'vue'
import Router from 'vue-router'
import Music from '../views/Music/Music'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/music'
    },
    {
      path: '/music',
      name: 'music',
      component: Music,
      redirect:'/music/index',
      children:[
        {
          path:'index',
          component:() => import('@/views/index/index')
        },
        {
          path:':id',
          component:() => import('@/views/disc/recomPlayDisc')
        }
      ]
    }
  ]
})
