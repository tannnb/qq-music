import {commonParams, options, debug} from './config'
import {getUid} from '../utils/tool'
import axios from 'axios/index'

export function getMvlist(options) {
    const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
    const url = `${prefix}/api/pc/getMvlist`

    const data = Object.assign({}, options, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        utf8: 1,
        pageno: 0,
        pagecount: 20,
        otype: 'json',
        taglist: 1,
        _: getUid(),
        data: {
          "comm": {
            "ct": 24
          },
          "mv_tag": {
            "module": "MvService.MvInfoProServer",
            "method": "GetAllocTag",
            "param": {}
          },
          "mv_list": {
            "module": "MvService.MvInfoProServer",
            "method": "GetAllocMvInfo",
            "param": {
              "start": 0,
              "size": 20,
              "version_id": 7,
              "area_id": 15,
              "order": 1
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


