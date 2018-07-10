const axios = require('axios')

module.exports = {

  getDiscList: (req, res) => {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
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

  getPurlUrl: (req, res) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    axios.post(url, req.body, {
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      res.json(response.data)
    }).catch((e) => {
      console.log('请求失败')
    })
  },

  getLyric: (req, res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    axios.post(url, req.body, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      }
    }).then((response) => {
      let ret = response.data
      if (typeof ret === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = ret.match(reg)
        if (matches) {
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    }).catch((e) => {
      console.log('请求失败')
    })
  },

  review: (req, res) => {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg'
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

