import {commonParams, options} from './config'
import {getUid} from "../utils/tool";
import axios from 'axios'
import {Base64} from "js-base64";

export function clientSearch(searchText) {
  const url = 'http://localhost:3000/clientSearch'

  const data = Object.assign({}, commonParams, {
    g_tk: 2054146370,
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.center',
    searchid: getUid(),
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: 1,
    n: 20,
    w: searchText,
    hostUin: 0,
    loginUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}



export default class Song {
  constructor({id, mid,albumdesc,isonly, singer, name, album, duration, image, url}) {
    this.id = id
    this.albumdesc = albumdesc
    this.isonly = isonly
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }

}

export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    albumdesc:musicData.desc,
    isonly:musicData.isonly,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album: musicData.album.title,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${musicData.singer[0].mid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}


// 拼接多位歌手
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

