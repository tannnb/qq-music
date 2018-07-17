import Vue from 'vue'
import Router from 'vue-router'
import Music from '../views/Music/Music'
import Singer from '../views/singer/singer'
import Album from '../views/album/album'

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
          component:() => import('@/views/index/index'),
        },
        {
          path:'singer',
          name:'singer',
          component:Singer
        },
        {
          path:'album',
          name:'album',
          component:Album
        },
        {
          path:':id',
          component:() => import('@/views/disc/recomPlayDisc')
        }
      ]
    },

  ]
})
