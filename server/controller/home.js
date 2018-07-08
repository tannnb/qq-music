const axios = require('axios')

module.exports = {
  musicu: async (ctx, next) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    await axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: ctx.query
    })
      .then((response) => {
        ctx.response.body = response.data
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },

  recommend: async (ctx, next) => {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    await axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: ctx.query
    })
      .then((response) => {
        ctx.response.body = response.data
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },

  newSongType:async (ctx,next) => {
    const url ='https://u.y.qq.com/cgi-bin/musicu.fcg'
    await axios.get(url,{
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: ctx.query
    })
      .then((response) => {
        ctx.response.body = response.data
      })
      .catch((e) => {
        console.log('请求失败')
      })
  },

  newAlbumArea:async(ctx,next) => {
    const url ='https://u.y.qq.com/cgi-bin/musicu.fcg'
    await axios.get(url,{
      headers: {
        referer: 'https://c.y.qq.com/'
      },
      params: ctx.query
    })
      .then((response) => {
        ctx.response.body = response.data
      })
      .catch((e) => {
        console.log('请求失败')
      })
  }

}


