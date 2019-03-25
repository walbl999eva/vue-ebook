<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-footer-tab-wrapper"
         v-for="item in tabs"
         :key="item.index"
         @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <div class="icon-private tab-icon" v-if="item.index===1 && !isAllPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index===1 && isAllPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index===2 && !isAllDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index===2 && isAllDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index===3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index===4"></div>
        <div class="tab-text" :class="{'remove-text':item.index===4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { saveBookShelf, removeLocalStroage } from '../../utils/localStorage'
  import { download } from '../../api/store'
  import { removeLocalForage } from '../../utils/localForage'

  export default {
    name: 'ShelfFooter',
    mixins: [storeShelfMixin],
    data() {
      return {
        popupMenu: null
      }
    },
    computed: {
      tabs() {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      },
      isSelected() {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      isAllPrivate() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.private)
        }
      },
      isAllDownload() {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    methods: {
      label(item) {
        switch (item.index) {
          case 1:
            return this.isAllPrivate ? item.label2 : item.label
          case 2:
            return this.isAllDownload ? item.label2 : item.label
          default:
            return item.label
        }
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      onComplete() {
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
      },
      setPrivate() {
        let isNeedPrivate
        isNeedPrivate = !this.isAllPrivate
        this.shelfSelected.forEach(item => {
          item.private = isNeedPrivate
        })
        this.onComplete()
        if (isNeedPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      showPrivate() {
        this.popupMenu = this.popup({
          title: this.isAllPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.isAllPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      downloadBook(book) {
        let text = ''
        const toast = this.toast({
          text: text
        })
        toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book, book => {
            toast.remove()
            resolve(book)
          }, reject, progressEvent => {
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
            toast.updateText(text)
          })
        })
      },
      removeSelectedBook() {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
          .then(books => {
            books.map(book => {
              book.cache = false
            })
            saveBookShelf(this.shelfList)
            this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
          })
      },
      removeBook(book) {
        return new Promise((resolve, reject) => {
          removeLocalStroage(`${book.categoryText}/${book.fileName}-info`)
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      async downloadSelectedBook() {
        for (let i = 0; i < this.shelfSelected.length; i++) {
          if (this.shelfSelected[i].cache === false) {
            await this.downloadBook(this.shelfSelected[i])
              .then(book => {
                book.cache = true
              })
          }
        }
      },
      async setDownload() {
        this.onComplete()
        if (this.isAllDownload) {
          this.removeSelectedBook()
        } else {
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.setDownloadSuccess'))
        }
      },
      showDownLoad() {
        this.popupMenu = this.popup({
          title: this.isAllDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
          btn: [
            {
              text: this.isAllDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      removeSelected() {
        this.shelfSelected.forEach(selected => {
          this.setShelfList(this.shelfList.filter(item => item !== selected))
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      showRemove() {
        let title
        if (this.shelfSelected.length === 1) {
          title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: this.$t('shelf.removeBook'),
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        }).show()
      },
      onTabClick(item) {
        if (!this.isSelected) return
        switch (item.index) {
          case 1:
            this.showPrivate()
            break
          case 2:
            this.showDownLoad()
            break
          case 3:
            this.dialog().show()
            break
          case 4:
            this.showRemove()
            break
          default:
            break
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-footer{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: 48px;
    background: #fff;
    box-shadow: 0 -2px 4px rgba(0,0,0,.1);
    .shelf-footer-tab-wrapper{
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab{
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected{
          opacity: 1;
        }
        .tab-icon{
          font-size: 20px;
          color: #666;
        }
        .tab-text{
          margin-top: 5px;
          font-size: 12px;
          color: #666;
        }
        .icon-shelf{
          color: $color-pink;
        }
        .remove-text{
          color: $color-pink;
        }
      }
    }
  }
</style>
