import {commonParams, options} from './config'
import {getUid} from '../utils/tool'
import axios from "axios/index";

const debug = process.env.NODE_ENV !== 'production'

export function getMvlist(options) {
  const url = debug ? 'http://localhost:3000/getMvlist' : '/pc/getMvlist'
  const data = Object.assign({},options, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    utf8: 1,
    type: options.type? options.type:1,
    year: options.year? options.year:0,
    area: options.area? options.area:0,
    tag: options.tag? options.tag:0,
    pageno: 0,
    pagecount: 20,
    otype: 'json',
    taglist: 1,
    _: getUid()
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

