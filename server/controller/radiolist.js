const axios = require('axios')

module.exports = {

  station: (req, res) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg'
    response(url,req,res)
  },
  getRadioDesc:(req,res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    response(url,req,res)
  },
  back_lyric:(req,res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
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
      res.json({code:404,msg:'请求失败'})
    })
}

