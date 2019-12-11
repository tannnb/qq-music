import { commonParams, debug } from './config'
import axios from 'axios/index'

export function toplistOpt () {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/toplistOpt`
  const data = Object.assign({}, commonParams, {
    page: 'index',
    format: 'html',
    tpl: 'macv4',
    v8debug: 1,
    jsonCallback: 'jsonCallback'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function toplistCp (date, topid, type, song_begin = 0) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/toplistCp`
  const data = Object.assign({}, {
    tpl: 3,
    page: 'detail',
    date,
    topid,
    type: type == 1 ? 'top' : 'global',
    song_begin,
    song_num: 20,
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
