import { commonParams, debug } from './config'
import axios from 'axios/index'

export function getSingerList (options) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSingerList`
  const params = Object.assign({}, {
    'comm': {
      'ct': 24,
      'cv': 10000
    },
    'singerList': {
      'module': 'Music.SingerListServer',
      'method': 'get_singer_list',
      'param': {
        'index': options ? options.index : -100,
        'area': options ? options.area : -100,
        'sex': options ? options.sex : -100,
        'genre': options ? options.genre : -100,
        'sin': options ? options.sin : 0,
        'cur_page': options ? options.cur_page : 1
      }
    }
  })

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    data: JSON.stringify(params)
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSingerDesc (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSingerDesc`
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    singermid: mid,
    order: 'listen',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    begin: 0,
    num: 80,
    songstatus: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSingerAlbum (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSingerAlbum`
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    singermid: mid,
    order: 'time',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    begin: 0,
    num: 5,
    songstatus: 1
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSingerMv (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSingerMv`
  const data = Object.assign({}, commonParams, {
    g_tk: 1194859437,
    cid: 205360581,
    platform: 'yqq',
    singermid: mid,
    order: 'listen',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    begin: 0,
    num: 5
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function gerSingerFan (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/gerSingerFan`
  const data = Object.assign({}, commonParams, {
    reqtype: 1,
    singermid: mid,
    g_tk: 1194859437,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    format: 'jsonp',
    cid: 205361944,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function getSingerMvUrl (vid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getSingerMvUrl`
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    outCharset: 'GB2312',
    format: 'jsonp',
    needNewCode: 0,
    data: {
      'getMvUrl': {
        'module': 'gosrf.Stream.MvUrlProxy',
        'method': 'GetMvUrls',
        'param': {
          'vids': [vid], 'request_typet': 10001
        }
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

class Dplayer {
  constructor () {

  }
}

export function createDplayer (musicData) {
  return new Dplayer({

  })
}
