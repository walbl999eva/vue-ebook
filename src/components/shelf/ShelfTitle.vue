<template>
  <transition name="fade">
    <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow':ifHideShadow}">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="shelf-title-btn-wrapper"
           :class="{'shelf-title-left':changeGroupLeft,'shelf-title-right':changeGroupRight}"
           @click="changeGroup"
           v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { clearLocalStroage, saveBookShelf } from '../../utils/localStorage'
  import { clearLocalForage } from '../../utils/localForage'

  export default {
    name: 'ShelfTitle',
    mixins: [storeShelfMixin],
    data() {
      return {
        ifHideShadow: true
      }
    },
    props: {
      title: String
    },
    watch: {
      offsetY(v) {
        if (v > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      emptyCategory() {
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },
      showClear() {
        return this.currentType === 1
      },
      showEdit() {
        return this.currentType === 1 || !this.emptyCategory
      },
      selectedText() {
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        return selectedNumber <= 0 ? this.$t('shelf.selectBook')
          : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber)
          : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      },
      showBack() {
        return this.currentType === 2 && !this.isEditMode
      },
      showChangeGroup() {
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      changeGroupLeft() {
        return !this.emptyCategory
      },
      changeGroupRight() {
        return this.emptyCategory
      },
      popupCancelBtn() {
        return this.createPopupBtn(this.$t('shelf.cancel'), () => {
          this.hidePopup()
        })
      }
    },
    methods: {
      onComplete() {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id))
          .then(() => {
            saveBookShelf(this.shelfList)
            this.setIsEditMode(false)
            this.$router.go(-1)
          })
      },
      deleteGroup() {
        if (!this.emptyCategory) {
          this.setShelfSelected(this.shelfCategory.itemList)
          this.moveOutOfGroup(this.onComplete)
        } else {
          this.onComplete()
        }
      },
      changeGroupName() {
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title
        }).show()
      },
      showDeleteGroup() {
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: this.$t('shelf.deleteGroupTitle'),
            btn: [
              this.createPopupBtn(this.$t('shelf.confirm'), () => {
                this.deleteGroup()
              }, 'danger'),
              this.popupCancelBtn
            ]
          }).show()
        }, 200)
      },
      hidePopup() {
        this.popupMenu.hide()
      },
      createPopupBtn(text, onClick, type = 'normal') {
        return {
          text: text,
          type: type,
          click: onClick
        }
      },
      changeGroup() {
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
              this.changeGroupName()
            }),
            this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
              this.showDeleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      },
      back() {
        this.$router.go(-1)
        this.setIsEditMode(false)
      },
      onEditClick() {
        if (!this.isEditMode) {
          this.setShelfSelected([])
          this.shelfList.forEach(item => {
            item.selected = false
            if (item.itemList) {
              item.itemList.forEach(subItem => {
                subItem.selected = false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },
      clearCache() {
        clearLocalStroage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()
        this.simpleToast(this.$t('shelf.clearCacheSuccess'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title{
    position: relative;
    width: 100%;
    height: 42px;
    background: #fff;
    z-index: 130;
    box-shadow: 0 2px 2px rgba(0,0,0,.1);
    &.hide-shadow{
      box-shadow: none;
    }
    .shelf-title-text-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 42px;
      @include columnCenter;
      .shelf-title-text{
        font-size: 16px;
        line-height: 20px;
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text{
        font-size: 10px;
        color: #333;
      }
    }
    .shelf-title-btn-wrapper{
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text{
        font-size: 14px;
        color: #666;
      }
      &.shelf-title-left{
        left: 0;
        padding-left: 15px;
      }
      &.shelf-title-right{
        right: 0;
        padding-right: 15px;
      }
      .icon-back{
        font-size: 20px;
        color: #666;
      }
    }
  }
</style>
