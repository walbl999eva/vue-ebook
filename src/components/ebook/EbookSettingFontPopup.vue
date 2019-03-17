<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <ul class="ebook-popup-list-wrapper">
        <li class="ebook-popup-item"
            v-for="(item,index) in fontFamilyList"
            :key="index"
            @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-item-text"
               :class="{'selected': isSelected(item)}"
          >{{item.font}}</div>
          <div class="ebook-popup-item-check"
               v-if="isSelected(item)"
          >
            <span class="icon-check"></span>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { FONT_FAMILY } from '../../utils/book'
  import { saveFontFamily } from '../../utils/localStorage'

  export default {
    name: 'EbookSettingFontPopup',
    mixins: [ebookMixin],
    data() {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      hide() {
        this.setFontFamilyVisible(false)
      },
      isSelected(item) {
        return this.defaultFontFamily === item.font
      },
      setFontFamily(font) {
        this.setDefaultFontFamily(font)
        saveFontFamily(this.fileName, font)
        if (font === 'Default') {
          this.currentBook.rendition.themes.font('Times New Roman')
        } else {
          this.currentBook.rendition.themes.font(font)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .ebook-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background: #fff;
    box-shadow: 0 -4px 6px rgba(0,0,0,.15);

    .ebook-popup-title{
      position: relative;
      padding: 15px;
      border-bottom: 1px solid #b8b9bb;
      @include center;

      .ebook-popup-title-icon{
        position: absolute;
        left: 25px;
        top: 0;
        height: 100%;
        font-size: 16px;
        font-weight: bold;
        @include center;
      }
      .ebook-popup-title-text{
        font-size: 14px;
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper{
      .ebook-popup-item{
        display: flex;
        padding: 15px;

        .ebook-popup-item-text{
          flex: 1;
          font-size: 14px;

          &.selected{
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check{
          flex: 1;
          text-align: right;
          font-size: 14px;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
