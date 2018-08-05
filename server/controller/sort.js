const axios = require('axios')

module.exports = {
  getSortTags: (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';
    response(url, req, res)
  },
  getSortList: (req, res) => {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    response(url, req, res)
  },
  getSortDesc: (req, res) => {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
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

