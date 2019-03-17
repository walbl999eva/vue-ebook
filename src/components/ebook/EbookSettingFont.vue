<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
          <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
      </div>
      <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="setting-font-family-text-wrapper">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { FONT_SIZE_LIST } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'
  import { saveFontSize } from '../../utils/localStorage'

  export default {
    name: 'EbookSettingFont',
    mixins: [ebookMixin],
    data() {
      return {
        fontSizeList: FONT_SIZE_LIST
      }
    },
    methods: {
      setFontSize(fontSize) {
        this.setDefaultFontSize(fontSize)
        saveFontSize(this.fileName, fontSize)
        this.currentBook.rendition.themes.fontSize(fontSize)
      },
      showFontFamilyPopup() {
        this.setFontFamilyVisible(true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 48px;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 90px;
    background: white;
    box-shadow: 0 -8px 8px rgba(0, 0, 0, .15);
    .setting-font-size {
      display: flex;
      flex: 2;
      height: 100%;
      .preview {
        position: relative;
        flex: 0 0 40px;
        @include center;

        &:first-child{
          left: calc(((100% - 80px) / 14 + 40px) / 2 - 20px);
        }
        &:last-child{
          right: calc(((100% - 80px) / 14 + 40px) / 2 - 20px);
        }
      }
      .select {
        display: flex;
        flex: 1;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: 1px solid #ccc;
          }
          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: 7px;
            border-left: 1px solid #ccc;
            .point {
              position: absolute;
              top: -8px;
              left: -1px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 1px solid #ccc;
              box-shadow: 0 4px 4px rgba(0, 0, 0, .15);
              //@include center;
              .small-point {
                transform: translate3d(7.5px,7.5px,0);
                width: 5px;
                height: 5px;
                background: black;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
    .setting-font-family{
      flex: 1;
      font-size: 14px;
      @include center;

      .setting-font-family-text-wrapper{
        @include center;
      }
      .setting-font-family-icon-wrapper{
        @include center;
      }
    }
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 30px;
        box-sizing: border-box;
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: 2px;
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: 1px solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        color: #333;
        font-size: 12px;
        text-align: center;
      }
    }
  }
</style>
