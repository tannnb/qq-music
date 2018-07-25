
// 时间转换
export function format(interval) {
  interval = interval | 0
  const minute = interval / 60 | 0
  const second = _pad(interval % 60)
  return `${minute}:${second}`
}

function _pad(num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}


// 播放数
export function paddListenCount(number) {
  return (number / 10000).toFixed(1) + '万'
}


// 歌手
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.singer_name)
  })
  return ret.join('/')
}
