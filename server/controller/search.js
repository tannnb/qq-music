const axios = require('axios')

module.exports = {
  gethotkey: (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    response(url, req, res)
  },
  clientSearch: (req, res) => {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
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

