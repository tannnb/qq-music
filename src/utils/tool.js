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
  if (Number(number) < 10000) {
    return number
  }
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


export function getUid() {
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

export function debounce(func, delay = 300) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}


/**
 * 歌词解析类模型
 */
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
// const tagRegMap = {
//     title: 'ti',
//     artist: 'ar',
//     album: 'al',
//     offset: 'offset',
//     by: 'by'
// };
export class Lyric {
  constructor (lrc) {
    this.lrc = lrc;
    this.lyric = [];
    this._init();
  }

  _init () {
    this._initLines();
  }

  _initLines () {
    const lines = this.lrc.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let result = timeExp.exec(line);
      if (result) {
        const txt = line.replace(timeExp, '').trim();
        if (txt) {
          if (this.type === 'qq') {
            this.lyric.push({
              time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
              txt
            });
          } else {
            this.lyric.push({
              time: Number(result[1] * 60 * 1000) + Number(result[2] * 1000) + Number(result[3] || 0),
              txt
            });
          }
        }
      }
    }

    this.lyric.sort((a, b) => {
      return a.time - b.time;
    });
  }
};
