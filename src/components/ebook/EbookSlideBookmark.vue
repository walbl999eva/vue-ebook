<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} ・ {{bookmarkList ? bookmarkList.length : 0}}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item"
           v-for="(item,index) in bookmarkList"
           :key="index"
           @click="displayBookmark(item.cfi)"
      >
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '../common/Scroll'
  import { getBookmark } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'EbookSlideBookmark',
    mixins: [ebookMixin],
    components: {
      Scroll
    },
    created() {
        this.setBookmarkList(getBookmark(this.fileName))
    },
    methods: {
      displayBookmark(target) {
        this.display(target, () => {
          this.hideTitleAndMenu()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-slide-bookmark{
    width: 100%;
    .slide-bookmark-title{
      width: 100%;
      height: 48px;
      font-size: 14px;
      font-weight: bold;
      padding: 0 15px;
      box-sizing: border-box;
      @include left;
    }
  }
  .slide-bookmark-list{
    padding: 0 15px;
    box-sizing: border-box;
    .slide-bookmark-item{
      display: flex;
      padding: 15px 0;
      box-sizing: border-box;
      .slide-bookmark-item-icon{
        flex: 0 0 29px;
        @include left;
        .icon-bookmark{
          width: 20px;
          height: 20px;
          font-size: 12px;
          border-radius: 50%;
          background: #bbb;
          @include center;
        }
      }
      .slide-bookmark-item-text{
        font-size: 14px;
        line-height: 16px;
        min-height: 45px;
        @include multiline-ellipsis(3)
      }
    }
  }

</style>
