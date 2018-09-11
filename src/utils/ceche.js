import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 5

const ID_KEY = '__saveID__'
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

// 增加
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  // 只有一条数据时，直接写入
  if (index === 0) {
    return false
  }
  // 当有多条数据时，将当前数据删除，在数据第一条前 插入新数据
  if (index > 1) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
// 删除
function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1)
  }
}


// 保存搜索
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)
  return searches
}
// 读取搜索
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
// 删除搜索
export function deleteSearch(song) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === song
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 清除全部搜索
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存歌手id/mid
export function saveSingId(id) {
  return  storage.set(ID_KEY, id)
}
// 读取歌手ID/mid
export function loadSingId() {
  return storage.get(ID_KEY, '')
}
// 收藏
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY,[])
}
