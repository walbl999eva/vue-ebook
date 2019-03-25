import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStroage (key, value) {
  return localStorage.set(key, value)
}

export function getLocalStroage (key) {
  return localStorage.get(key)
}

export function removeLocalStroage (key) {
  return localStorage.delete(key)
}

export function clearLocalStroage () {
  return localStorage.clear()
}

export function setBookObject (fileName, key, value) {
  let book = getLocalStroage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStroage(`${fileName}-info`, book)
}

export function getBookObject (fileName, key) {
  let book = getLocalStroage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}

export function getFontFamily (fileName) {
  return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily (fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}

export function getTheme (fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme (fileName, theme) {
  return setBookObject(fileName, 'theme', theme)
}

export function getFontSize (fileName) {
  return getBookObject(fileName, 'fontSize')
}

export function saveFontSize (fileName, fontSize) {
  return setBookObject(fileName, 'fontSize', fontSize)
}

export function getCover (fileName) {
  return getBookObject(fileName, 'cover')
}

export function saveCover (fileName, cover) {
  return setBookObject(fileName, 'cover', cover)
}

export function getMetadata (fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata (fileName, metadata) {
  return setBookObject(fileName, 'metadata', metadata)
}

export function getNavigation (fileName) {
  return getBookObject(fileName, 'navigation')
}

export function saveNavigation (fileName, navigation) {
  return setBookObject(fileName, 'navigation', navigation)
}

export function getProgress (fileName) {
  return getBookObject(fileName, 'progress')
}

export function saveProgress (fileName, progress) {
  return setBookObject(fileName, 'progress', progress)
}

export function getReadTime (fileName) {
  return getBookObject(fileName, 'time')
}

export function saveReadTime (fileName, time) {
  return setBookObject(fileName, 'time', time)
}

export function getBookmark (fileName) {
  return getBookObject(fileName, 'bookmark')
}

export function saveBookmark (fileName, bookmark) {
  return setBookObject(fileName, 'bookmark', bookmark)
}

export function getLocation (fileName) {
  return getBookObject(fileName, 'location')
}

export function saveLocation (fileName, location) {
  return setBookObject(fileName, 'location', location)
}

export function getLocale () {
  return getLocalStroage('locale')
}

export function saveLocale (locale) {
  return setLocalStroage('locale', locale)
}

export function saveBookShelf(shelf) {
  return setLocalStroage('shelf', shelf)
}

export function getBookShelf() {
  return getLocalStroage('shelf')
}
