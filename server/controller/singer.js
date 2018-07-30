const axios = require('axios')

module.exports = {

  getSingerList: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url, req, res)
  },

  getSingerDesc: (req, res) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    response(url, req, res)
  },

  getSingerAlbum: (req, res) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg'
    response(url, req, res)
  },

  getSingerMv: (req, res) => {
    const url = 'https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg'
    response(url, req, res)
  },

  gerSingerFan: (req, res) => {
    const url = 'https://c.y.qq.com/rsc/fcgi-bin/fcg_get_singer_fan_num.fcg'
    response(url, req, res)
  }

}


function response(url, req, res) {
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


