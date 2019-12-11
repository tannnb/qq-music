import { commonParams, debug } from './config'
import axios from 'axios'

export function getSortTags () {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSortTags`
  const data = Object.assign({}, commonParams, {
    g_tk: '455128728',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSortList (categoryId, sortId, sin) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSortList`
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    g_tk: 455128728,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    rnd: getUid(),
    categoryId,
    sortId,
    sin,
    ein: 29 + sin
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSortDesc (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSortDesc`
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    onlysong: 0,
    disstid: mid,
    g_tk: 775521381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    let ret = res.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    return Promise.resolve(ret)
  })
}

function getUid () {
  var t = (new Date()).getUTCMilliseconds()
  var _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  return _uid
}
