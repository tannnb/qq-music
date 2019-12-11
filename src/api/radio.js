import { commonParams, ERR_OK, options, debug } from './config'
import axios from 'axios'
import { Base64 } from 'js-base64'

export function station () {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/station`
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

export function getRadioDesc (id) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/getRadioDesc`
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      'songlist': {
        'module': 'pf.radiosvr',
        'method': 'GetRadiosonglist',
        'param': {
          'id': Number(id),
          'firstplay': 1,
          'num': 30
        }
      },
      'comm': {
        'ct': '24'
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export function StateLyric (mid) {
  const prefix = debug ? 'http://localhost:7001' : 'http://api.tannnb.com'
  const url = `${prefix}/api/pc/back_lyric`
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export default class Song {
  constructor ({ id, mid, albumdesc, isonly, singer, name, album, duration, image, url }) {
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

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      StateLyric(this.mid).then((res) => {
        let ret = res.trim()
        let result = ret.replace(/\n/g, '')
        const matches = result.replace(/^\w+\(/, '')
        const str = matches.replace(/\)$/, '')
        const listOpt = JSON.parse(str)
        if (listOpt.retcode === ERR_OK) {
          this.lyric = Base64.decode(listOpt.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    album: musicData.album.name,
    albumdesc: musicData.album.title,
    isonly: musicData.isonly,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
