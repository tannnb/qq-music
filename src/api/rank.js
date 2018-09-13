import {commonParams} from './config'
import axios from "axios/index";

const debug = process.env.NODE_ENV !== 'production'

export function toplistOpt() {
  const url = debug ? 'http://localhost:3000/toplistOpt' : '/pc/toplistOpt'
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

export function toplistCp(date, topid, type, song_begin = 0) {
  const url = debug ? 'http://localhost:3000/toplistCp' : '/pc/toplistCp'
  const data = Object.assign({}, {
    tpl: 3,
    page: 'detail',
    date,
    topid,
    type: type == 1 ? 'top' : 'global',
    song_begin,
    song_num: 30,
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

