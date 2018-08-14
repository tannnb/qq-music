import {commonParams, options} from './config'
import axios from "axios/index";


export function toplistOpt(options) {
  const url = 'http://localhost:3000/toplistOpt'

  const data = Object.assign({},commonParams, {
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

export function toplistCp(date,topid,type) {
  const url = 'http://localhost:3000/toplistCp'

  const data = Object.assign({}, {
    tpl: 3,
    page: 'detail',
    date,
    topid,
    type:type == 1? 'top':'global',
    song_begin: 0,
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

