import {commonParams, options} from './config'
import axios from "axios/index";


export function toplistOpt(options) {
  const url = 'http://localhost:3000/toplistOpt'

  const data = Object.assign({}, {
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
