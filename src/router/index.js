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
        {
          path:'rank',
          name:'rank',
          component:() => import('@/views/rank/rank')
        },
        {
          path:'sort',
          name:'sort',
          component:() => import('@/views/sort/sort')
        },
        {
          path:'sort/:mid',
          name:'sort_desc',
          component:() => import('@/views/sort_desc/sort_desc')
        },
        {
          path:'digitalalbum',
          name:'digitalalbum',
          component:() => import('@/views/digitalalbum/digitalalbum')
        },
        {
          path:'station',
          name:'station',
          component:() => import('@/views/station/station')
        },
        {
          path:'mv',
          name:'mv',
          component:() => import('@/views/mv/mv')
        },
      ]
    }
  ]
})
