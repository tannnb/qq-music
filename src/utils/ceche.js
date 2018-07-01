import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 3


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

function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1)
  }
}


export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])

  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(song) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === song
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
