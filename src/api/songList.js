import {commonParams} from "./config";
import {ERR_OK} from "./config";
import axios from 'axios'
import {Base64} from 'js-base64'

const debug = process.env.NODE_ENV !== 'production'

export default class Song {
  constructor({id, mid, albumdesc, isonly, singer, name, album, duration, image, url,cur_count,in_count,old_count,Franking_value}) {
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
    this.cur_count = cur_count
    this.in_count = in_count
    this.old_count = old_count
    this.Franking_value = Franking_value
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

export function createSong(musicData,list) {
  return new Song({
    id: musicData.songid,
    albumdesc: musicData.albumdesc,
    isonly: musicData.isonly,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url,
    cur_count: list ? list.cur_count : '',
    in_count: list ? list.in_count : '',
    old_count: list ? list.old_count : '',
    Franking_value:list? list.Franking_value :''
  })
}

// 获取歌词
function getLyric(mid) {
  const url = debug ? 'http://localhost:3000/lyric' : '/pc/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}


// 获取播放地址
export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo
      midUrlInfo.forEach((info, index) => {
        let song = songs[index]
        song.url = info.purl
      })
    }
    return songs
  })

}


export function getSongsUrl(songs) {
  const url = debug ? 'http://localhost:3000/getPurlUrl' : '/pc/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })


  const urlMid = genUrlMid(mids, types)   // 生成data参数

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request() {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      })
        .then((response) => {
          const res = response.data
          if (res.code === ERR_OK) {
            let urlMid = res.url_mid
            if (urlMid && urlMid.code === ERR_OK) {
              const info = urlMid.data.midurlinfo[0]
              info && info.purl ? resolve(res) : retry()
            } else {
              retry()
            }
          } else {
            retry()
          }
        })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}


function getUid() {
  let _uid = ''
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
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


export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}
