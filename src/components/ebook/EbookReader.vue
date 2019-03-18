<template>
  <div class="ebook-reader">
    <div id="read"></div>
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

  export default {
    name: 'EbookReader',
    mixins: [ebookMixin],
    methods: {
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
      initEpub() {
        const url = `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRendition()
        this.initGesture()
        this.parseBook()
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          // console.log(locations)
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.setFileName(fileName)
        .then(() => {
          this.initEpub()
        })
    }
  }
</script>

<style lang="scss" scoped>

</style>
