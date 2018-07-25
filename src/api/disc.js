import jsonp from '../utils/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'


export function getDiscList(id) {
  const url = 'http://localhost:3000/getDiscList'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: id,
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


export function review(mid, pagenum = 0) {
  const url = 'http://localhost:3000/review'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'GB2312',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205360772,
    reqtype: 2,
    biztype: 3,
    topid: mid,
    cmd: 8,
    needmusiccrit: 0,
    pagenum: pagenum,
    pagesize: 25,
    lasthotcommentid: '',
    domain: 'qq.com',
    ct: 24,
    cv: 101010,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getNewAlbumSong(mid) {
  const url = 'http://localhost:3000/getNewAlbumSong'

  const data = Object.assign({}, commonParams, {
    albummid: mid,
    g_tk: 125702638,
    hostUin: 0,
    jsonpCallback:'albuminfoCallback',
    loginUin:0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

