const axios  = require('axios')

module.exports = {
  getMvlist: (req, res) => {
    const url = 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag'
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
