<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"/>
    </div>
  </div>
</template>

<script>
  import Bookmark from '../common/Bookmark'
  import { realPx } from '../../utils/utils'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'

  const BLUE = '#346cbc'
  const WHITE = '#fff'

  export default {
    name: 'EbookBookmark',
    mixins: [ebookMixin],
    data() {
      return {
        text: '',
        color: '',
        isFixed: false
      }
    },
    watch: {
      offsetY(v) {
        if (!this.bookAvailable || this.menuVisible) return
        if (v >= this.height && v < this.threshold) {
          // 2
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          // 3
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          // 1
          this.beforeHeight()
        } else if (v === 0) {
          // 4
          this.restore()
        }
      },
      isBookmark(boolean) {
        this.isFixed = boolean
        if (boolean) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    computed: {
      height() {
        return realPx(35)
      },
      threshold() {
        return realPx(50)
      },
      fixedStyle() {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clinetWidth) / 2}px`
        }
      }
    },
    methods: {
      addBookmark() {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`

        this.currentBook.getRange(cfirange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          // localStorage
          saveBookmark(this.fileName, this.bookmark)
          // vuex
          this.setBookmarkList(this.bookmark)
        })
      },
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
          saveBookmark(this.fileName, this.bookmark)
          // vuex
          this.setBookmarkList(this.bookmark)
          this.setIsBookmark(false)
        }
      },
      restore() {
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        if (this.isFixed) {
          if (!this.isBookmark) {
            this.setIsBookmark(true)
            this.addBookmark()
          }
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      beforeHeight() {
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold(v) {
        this.$refs.bookmark.style.top = `${-v}px`
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      }
    },
    components: {
      Bookmark
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-bookmark{
    position: absolute;
    top: -35px;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 35px;
    .ebook-bookmark-text-wrapper{
      position: absolute;
      right: 45px;
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper{
        font-size: 14px;
        color: #fff;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text{
        font-size: 14px;
        color: #fff;
      }
    }
    .ebook-bookmark-icon-wrapper{
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: 15px;
    }
  }
</style>
