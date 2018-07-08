export class Createrecommend {
  constructor({content_id, mid, singerid, title, cover, listen_num}) {
    this.id = content_id
    this.mid = mid ? mid : ''
    this.singerid = singerid
    this.title = title
    this.image = cover
    this.duration = listen_num
    /* image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
     url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`*/
  }
}


export class CreateSong {
  constructor(musicData) {
    this.title = musicData.title
    this.name = musicData.singer[0].name
    this.id = musicData.id
    this.album_id = musicData.album.id
    this.album_mid = musicData.album.mid
    this.duration = musicData.interval
    this.image = `http://y.gtimg.cn/music/photo_new/T002R90x90M000${musicData.album.mid}.jpg?max_age=2592000`
  }
}

export class CreateBanner {
  constructor({mid, url}) {
    this.mid = mid
    this.url = url
  }
}

export class CreateAblum {
  constructor(musicData){
    this.album_id = musicData.album_id
    this.album_mid = musicData.album_mid
    this.album_name = musicData.album_name
    this.singer_id = musicData.singers[0].singer_id
    this.singer_mid = musicData.singers[0].singer_mid
    this.singer_name = musicData.singers[0].singer_name
    this.image = `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album_mid}.jpg?max_age=2592000`
  }
}



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


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
