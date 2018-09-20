const axios = require('axios')

module.exports = {
  gethotkey: (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    response(url, req, res)
  },
  clientSearch: (req, res) => {
    const url = ' https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    response(url, req, res)
  },
  clientSmartBox: (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg'
    response(url, req, res)
  }
}

function response(url, req, res) {
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
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

