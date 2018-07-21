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
          path:'index/:id',
          component:() => import('@/views/disc/recomPlayDisc')
        },
        {
          path:'singer',
          name:'singer',
          component:Singer
        },
        {
          path:'singer/:mid',
          name:'singer_desc',
          component: () => import('@/views/singer_desc/singer_desc')
        },
        {
          path:'album',
          name:'album',
          component:Album
        },
        {
          path:'album/:mid',
          name:'album_desc',
          component: () => import('@/views/album_desc/album_desc')
        },
      ]
    }
  ]
})
