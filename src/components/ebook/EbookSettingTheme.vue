<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div class="setting-theme-item"
             v-for="(item, index) in themeList"
             :key="index"
             @click="setTheme(index)"
        >
          <div class="preview"
               :style="{background: item.style.body.background}"
               :class="{'selected': item.name === defaultTheme}"
          ></div>
          <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { saveTheme } from '../../utils/localStorage'

  export default {
    name: 'EbookSettingTheme',
    mixins: [ebookMixin],
    methods: {
      setTheme(index) {
        const theme = this.themeList[index]
        this.setDefaultTheme(theme.name).then(() => {
          this.currentBook.rendition.themes.select(this.defaultTheme)
        })
        saveTheme(this.fileName, theme.name)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: 48px;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 90px;
    background: white;
    box-shadow: 0 -8px 8px rgba(0, 0, 0, .15);

    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 5px;
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: 1px solid #ccc;
          box-sizing: border-box;

          &.selected{
            box-shadow: 0 4px 6px rgba(0,0,0,.1);
          }
        }
        .text {
          flex: 0 0 20px;
          font-size: 14px;
          color: #ccc;
          @include center;
          &.selected {
            color: #333;
          }
        }
      }
    }
  }

</style>
