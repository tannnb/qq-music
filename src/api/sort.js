import {commonParams, options} from './config'
import axios from 'axios'

export function getSortTags() {
  const url = 'http://localhost:3000/getSortTags'
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

export function getSortList(categoryId,sortId,sin) {
  const url = 'http://localhost:3000/getSortList'
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
    ein: 29,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}


function getUid() {
  var t = (new Date).getUTCMilliseconds()
  var _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  return _uid
}

