import jsonp from '../utils/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function gethotkey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    loginUin: 0,
    needNewCode: 0
  })
  return jsonp(url, data, options)
}


export function musicu() {
  const url = 'http://localhost:3000/musicu'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: JSON.stringify({
      "comm": {
        "ct": 24
      },
      "category": {
        "method": "get_hot_category",
        "param": {
          "qq": ""
        },
        "module": "music.web_category_svr"
      },
      "recomPlaylist": {
        "method": "get_hot_recommend",
        "param": {
          "async": 1,
          "cmd": 2
        },
        "module": "playlist.HotRecommendServer"
      },
      "playlist": {
        "method": "get_playlist_by_category",
        "param": {
          "id": 8,
          "curPage": 1,
          "size": 40,
          "order": 5,
          "titleid": 8
        },
        "module": "playlist.PlayListPlazaServer"
      },
      "new_song": {
        "module": "QQMusic.MusichallServer",
        "method": "GetNewSong",
        "param": {
          "type": 0
        }
      },
      "new_album": {
        "module": "music.web_album_library",
        "method": "get_album_by_tags",
        "param": {
          "area": 1,
          "company": -1,
          "genre": -1,
          "type": -1,
          "year": -1,
          "sort": 2,
          "get_tags": 1,
          "sin": 0,
          "num": 40,
          "click_albumid": 0
        }
      },
      "toplist": {
        "module": "music.web_toplist_svr",
        "method": "get_toplist_index",
        "param": {}
      },
      "focus": {
        "module": "QQMusic.MusichallServer",
        "method": "GetFocus",
        "param": {}
      }
    })
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })

}


export function recommend(id) {
  const url = 'http://localhost:3000/recommend'

  const recomPlaylist = {
    "comm": {"ct": 24},
    "recomPlaylist": {
      "method": "get_hot_recommend",
      "module": "playlist.HotRecommendServer",
      "param": {"async": 1, "cmd": 2}
    }
  }

  const playlist = {
    "comm": {"ct": 24},
    "playlist": {
      "method": "get_playlist_by_category",
      "module": "playlist.PlayListPlazaServer",
      "param": {
        "id": id,
        "curPage": 1,
        "size": 40,
        "order": 5,
        "titleid": id
      }
    }
  }

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: !!!id ? recomPlaylist : playlist
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}


export function newSongType(id) {
  const url = 'http://localhost:3000/newSongType'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      "comm": {"ct": 24},
      "new_song": {
        "module": "QQMusic.MusichallServer",
        "method": "GetNewSong",
        "param": {"type": id}
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}


export function newAlbumArea(id) {
  const url = 'http://localhost:3000/newAlbumArea'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      "comm": {"ct": 24},
      "new_album": {
        "module": "music.web_album_library",
        "method": "get_album_by_tags",
        "param": {
          "area": id,
          "num": 40
        }
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}


