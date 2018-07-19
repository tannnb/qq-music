const axios = require('axios')

module.exports = {
  getAlbum: (req, res) => {
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
  }
}
