<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme } from '../../utils/localStorage'

  export default {
    name: 'EbookReader',
    mixins: [ebookMixin],
    methods: {
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
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
      hideTitleAndMenu() {
        this.setMenuVisible(false)
        this.setFontFamilyVisible(false)
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
          // 异步
          this.setDefaultTheme(defaultTheme)
          saveTheme(this.fileName, defaultTheme)
        }
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initEpub() {
        const url = 'http://192.168.123.4:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        // 拿到url开始DOM渲染
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          // 兼容微信
          method: 'default'
        })
        // 显示电子书
        this.rendition.display().then(() => {
          // 初始化读取localStorage，设置样式
          this.initFontFamily()
          this.initFontSize()
          this.initTheme()
        })
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
        // 内容加载完之后的钩子函数
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
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
