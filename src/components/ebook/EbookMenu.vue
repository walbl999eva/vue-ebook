<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font/>
    <ebook-setting-font-popup/>
    <ebook-setting-theme/>
    <ebook-setting-progress/>
  </div>
</template>

<script>
  import EbookSettingFontPopup from './EbookSettingFontPopup'
  import EbookSettingFont from './EbookSettingFont'
  import EbookSettingTheme from './EbookSettingTheme'
  import EbookSettingProgress from './EbookSettingProgress'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'EbookMenu',
    mixins: [ebookMixin],
    methods: {
      showSetting(key) {
        this.setSettingVisible(key)
      }
    },
    components: {
      EbookSettingFont,
      EbookSettingFontPopup,
      EbookSettingTheme,
      EbookSettingProgress
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .menu-bar {
    .menu-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 102;
      display: flex;
      width: 100%;
      height: 48px;
      background: white;
      box-shadow: 0 -8px 8px rgba(0, 0, 0, .15);
      font-size: 20px;

      &.hide-box-shadow {
        box-shadow: none;
      }

      .icon-wrapper {
        flex: 1;
        @include center;

        .icon-progress {
          font-size: 24px;
        }

        .icon-bright {
          font-size: 22px;
        }
      }
    }
  }
</style>
