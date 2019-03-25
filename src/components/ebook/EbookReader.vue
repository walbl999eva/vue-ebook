<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousedown.left="onMouseEnter"
         @mousemove.left="onMouseMove"
         @mouseup.left="onMouseEnd"
    ></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { flat } from '../../utils/book'
  import Epub from 'epubjs'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
  } from '../../utils/localStorage'
  import { getLocalForage } from '../../utils/localForage'

  export default {
    name: 'EbookReader',
    mixins: [ebookMixin],
    methods: {
      onMouseEnter(e) {
        this.mouseState = 1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseMove(e) {
        if (this.mouseState === 1) {
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            offsetY = e.clientY - this.firstOffsetY
            this.setOffsetY(offsetY)
          } else {
            this.firstOffsetY = e.clientY
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseEnd(e) {
        if (this.mouseState === 2) {
          this.setOffsetY(0)
          this.firstOffsetY = null
          this.mouseState = 3
        } else {
          this.mouseState = 4
        }
        // 根据点击事件差改变鼠标状态(允许点击时轻微移动)
        const time = e.timeStamp - this.mouseStartTime
        if (time < 100) {
          this.mouseState = 4
        }
        e.preventDefault()
        e.stopPropagation()
      },
      move(e) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        // 兼容微信
        e.preventDefault()
        e.stopPropagation()
      },
      moveEnd() {
        this.setOffsetY(0)
        this.firstOffsetY = null
      },
      onMaskClick(e) {
        if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
          return
        }
        const offsetX = e.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        this.setMenuVisible(!this.menuVisible)
        if (this.menuVisible) {
          this.setSettingVisible(-1)
        } else {
          this.setFontFamilyVisible(false)
        }
      },
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        // 异步
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initRendition() {
        // 拿到url开始DOM渲染
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          // 兼容微信
          method: 'default'
          // flow: 'scrolled'
        })

        const location = getLocation(this.fileName)
        // 显示电子书,有进度缓存直接显示进度位置
        this.display(location, () => {
          // 初始化读取localStorage，设置样式
          this.initFontFamily()
          this.initFontSize()
          this.initTheme()
          this.initGlobalStyle()
        })
        // 内容加载完之后的钩子函数
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
        })
      },
      initGesture() {
        // 绑定事件到iframe
        this.rendition.on('touchstart', e => {
          this.touchStartX = e.changedTouches[0].clientX
          this.touchStartTime = e.timeStamp
        })
        this.rendition.on('touchend', e => {
          const offsetX = e.changedTouches[0].clientX - this.touchStartX
          const time = e.timeStamp - this.touchStartTime
          // 限定touch事件时长，判断方向
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          e.preventDefault()
          e.stopPropagation()
        })
      },
      parseBook() {
        // 获取封面url
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        // 获取书籍信息
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        // 获取目录信息
        this.book.loaded.navigation.then(nav => {
          // 扁平化数据结构
          const navItem = flat(nav.toc)
          // 使用递归，判断每一项层级,0:一级目录，1：二级目录...
          function find (item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          // 遍历每一项增加对应level层级属性
          navItem.forEach(item => {
            item.level = find(item)
          })
          // 保存到vuex navigation
          this.setNavigation(navItem)
        })
      },
      initEpub(url) {
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRendition()
        this.initGesture()
        this.parseBook()
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          // 目录每一项增加pagelist属性存放章节每页cfi
          this.navigation.forEach(nav => {
            nav.pagelist = []
          })
          // 遍历每页信息获取cfi文本
          locations.forEach(item => {
            const loc = item.match(/\[(.*)\]!/)[1]
            // 将对应cfi放到对应导航章节目录下
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.html$/)[1]
                if (href === loc) {
                  nav.pagelist.push(item)
                }
              }
            })
            // 计算每章节第一页页码
            let curPage = 1
            this.navigation.forEach((nav, index) => {
              if (index === 0) {
                nav.page = 1
              } else {
                nav.page = curPage
              }
              curPage += nav.pagelist.length + 1
            })
          })
          this.setPagelist(locations)
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      }
    },
    mounted () {
      const books = this.$route.params.fileName.split('|')
      const fileName = books[1]
      getLocalForage(fileName, (err, blob) => {
        if (!err && blob) {
          console.log('找到离线缓存电子书')
          this.setFileName(books.join('/')).then(() => {
            this.initEpub(blob)
          })
        } else {
          console.log('在线获取电子书')
          this.setFileName(books.join('/'))
            .then(() => {
              const url = `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
              this.initEpub(url)
            })
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask{
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      z-index: 100;
      width: 100%;
      height: 100%;
    }
  }
</style>
