const axios  = require('axios')

module.exports = {
  musicu: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  },

  recommend: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  },

  newSongType: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  },

  newAlbumArea: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  }

}

function response (url, req, res) {
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
      res.json({code: 404, msg: '请求失败'})
    })
}
