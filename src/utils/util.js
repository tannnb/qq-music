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
