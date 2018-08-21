import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/music'
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('@/views/Music/Music'),
      redirect: '/music/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/index/index')
        },
        {
          path: 'index/:id',
          component: () => import('@/views/disc/recomPlayDisc')
        },
        {
          path: 'singer',
          name: 'singer',
          component: () => import('@/views/singer/singer')
        },
        {
          path: 'singer/:mid',
          name: 'singer_desc',
          component: () => import('@/views/singer_desc/singer_desc')
        },
        {
          path: 'album',
          name: 'album',
          component: () => import('@/views/album/album'),
        },
        {
          path: 'album/:mid',
          name: 'album_desc',
          component: () => import('@/views/album_desc/album_desc')
        },
        {
          path: 'rank',
          name: 'rank',
          component: () => import('@/views/rank/rank')
        },
        {
          path: 'sort',
          name: 'sort',
          component: () => import('@/views/sort/sort')
        },
        {
          path: 'sort/:mid',
          name: 'sort_desc',
          component: () => import('@/views/sort_desc/sort_desc')
        },
        {
          path: 'station',
          name: 'station',
          component: () => import('@/views/station/station')
        },
        {
          path: 'mv',
          name: 'mv',
          component: () => import('@/views/mv/mv')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/search/search')
        },
      ]
    }
  ]
})
