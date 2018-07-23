const axios = require('axios')

module.exports = {
  getSingerList: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: req.query
    })
      .then((response) => {
        res.json(response.data)
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },
  getSingerDesc: (req, res) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: req.query
    })
      .then((response) => {
        res.json(response.data)
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },
  getSingerAlbum:(req,res) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: req.query
    })
      .then((response) => {
        res.json(response.data)
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },
  getSingerMv:(req,res) => {
    const url = 'https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: req.query
    })
      .then((response) => {
        res.json(response.data)
      })
      .catch((e) => {
        console.log('请求失败')
      })
  }


}



