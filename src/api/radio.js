import jsonp from '../utils/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'


export function station() {
  const url = 'http://localhost:3000/station'

  const data = Object.assign({}, commonParams, {
    channel: 'radio',
    page: 'index',
    tpl: 'wk',
    new: 1,
    p: 0.17910908857451946,
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






