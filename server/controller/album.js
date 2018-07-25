const axios = require('axios')

module.exports = {

  getAlbum: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  },

  getAlbumDesc(req,res){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
    response(url,req,res)
  }

}

function response(url,req,res){
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
