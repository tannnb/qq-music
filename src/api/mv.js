import { commonParams, options, debug } from './config'
import { getUid } from '../utils/tool'
import axios from 'axios/index'

export function getMvlist (options) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getMvlist`
  const data = Object.assign({}, options, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    utf8: 1,
    type: options.type ? options.type : 1,
    year: options.year ? options.year : 0,
    area: options.area ? options.area : 0,
    tag: options.tag ? options.tag : 0,
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
