const router = require('koa-router')()
const HomeController = require('../controller/home')


module.exports = (app) => {
  router.get('/musicu', HomeController.musicu )
  router.get('/recommend',HomeController.recommend)
  router.get('/recommendType',HomeController.recommendType)
  app.use(router.routes())
}
