<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span :class="{'onload':!bookAvailable}">({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'EbookSettingProgress',
    mixins: [ebookMixin],
    updated() {
      this.updateProgressBg()
    },
    methods: {
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.displayProgress()
          this.updateProgressBg()
        })
      },
      onProgressInput(progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
      },
      displayProgress() {
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        this.display(cfi)
      },
      updateProgressBg() {
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },
      prevSection() {
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1).then(() => {
            this.displaySection()
          })
        }
      },
      nextSection() {
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.setSection(this.section + 1).then(() => {
            this.displaySection()
          })
        }
      },
      displaySection() {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          this.display(sectionInfo.href)
        }
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

    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;

      .read-time-wrapper{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 40px;
        font-size: 12px;
        @include center;

        .read-time-text{
          .icon-forward{}
        }
      }

      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 15px;
        box-sizing: border-box;

        .progress-icon-wrapper{
          font-size: 20px;
        }

        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: 2px;
          margin: 0 10px;

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
        bottom: 7px;
        width: 100%;
        color: #333;
        font-size: 12px;
        padding: 0 15px;
        box-sizing: border-box;
        @include center;

        .progress-section-text{
          flex: 1;
          line-height: 16px;
          margin-right: 5px;
          @include ellipsis;
        }
        .onload{
          width: 60px;
          text-align: center;
        }
      }
    }
  }
</style>
