const Koa = require('koa')
const app = new Koa()
const router = require('./router')


// CROS跨域设置
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  await next();
})

router(app)
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
