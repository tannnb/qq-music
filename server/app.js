const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const IndexController = require('./controller/index')
const DiscController = require('./controller/disc')
const SingerController = require('./controller/singer')
const AlbumController = require('./controller/album')
const radioController = require('./controller/radiolist')


// 加载解析json的中间件
/*app.use(bodyParser.json());*/

// 加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({extended: true}))


// CROS跨域设置
app.all("*", function (req, res, next) {
  if (req.path !== "/" && !req.path.includes(".")) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8")
  }
  next();
})

// 路由
app.get('/musicu', IndexController.musicu)
app.get('/recommend', IndexController.recommend)
app.get('/newSongType', IndexController.newSongType)
app.get('/newAlbumArea', IndexController.newAlbumArea)


app.get('/getNewAlbumSong', DiscController.getNewAlbumSong)
app.get('/getDiscList', DiscController.getDiscList)

// 获取歌曲信息以及播放地址
app.post('/getPurlUrl', bodyParser.json(),DiscController.getPurlUrl)
app.get('/lyric',DiscController.getLyric)

// 获取评论
app.get('/review',DiscController.review)

// 歌手
app.get('/singer',SingerController.getSingerList)
app.get('/singerdesc',SingerController.getSingerDesc)
app.get('/getSingerAlbum',SingerController.getSingerAlbum)
app.get('/getSingerMv',SingerController.getSingerMv)

// 专辑
app.get('/getAlbum',AlbumController.getAlbum)
app.get('/getAlbumDesc',AlbumController.getAlbumDesc)

// 电台
app.get('/station',radioController.station)



app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
