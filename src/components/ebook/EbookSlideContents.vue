<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input type="text"
               class="slide-contents-search-input"
               :placeholder="$t('book.searchHint')"
               @click="showSearchPage()"
        >
      </div>
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage()"
      >{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper">
      <div class="slide-contents-book-img-wrapper">
        <img class="slide-contents-book-img" :src="cover">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{metadata.title}}</div>
        <div class="slide-contents-book-author">{{metadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress+'%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'EbookSlideContents',
    mixins: [ebookMixin],
    data() {
      return {
        searchVisible: false
      }
    },
    methods: {
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-slide-contents{
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper{
      display: flex;
      width: 100%;
      height: 36px;
      margin: 20px 0 10px;
      padding: 0 15px;
      box-sizing: border-box;
      .slide-contents-search-input-wrapper{
        flex: 1;
        @include center;
        .slide-contents-search-icon{
          flex: 0 0 28px;
          font-size: 12px;
          @include center;
        }
        .slide-contents-search-input{
          flex: 1;
          width: 100%;
          height: 32px;
          font-size: 14px;
          background: transparent;
          border: none;
          &:focus{
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel{
        flex: 0 0 50px;
        font-size: 14px;
        @include right;
      }
    }
    .slide-contents-book-wrapper{
      display: flex;
      width: 100%;
      height: 90px;
      padding: 10px 15px 20px;
      box-sizing: border-box;
      .slide-contents-book-img-wrapper{
        flex: 0 0 45px;
        .slide-contents-book-img{
          width: 45px;
          height: 60px;
        }
      }
      .slide-contents-book-info-wrapper{
        flex: 1;
        padding: 0 10px;
        box-sizing: border-box;
        .slide-contents-book-title{
          width: 153.75px;
          font-size: 14px;
          line-height: 16px;
          @include multiline-ellipsis(2);
        }
        .slide-contents-book-author{
          font-size: 12px;
          line-height: 16px;
          margin-top: 5px;
          @include multiline-ellipsis(2);
        }
      }
      .slide-contents-book-progress-wrapper{
        flex: 0 0 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .slide-contents-book-progress{
          .progress{
            font-size: 14px;
          }
          .progress-text{
            font-size: 12px;
          }
        }
        .slide-contents-book-time{
          margin-top: 7px;
          font-size: 12px;
        }
      }
    }
  }

</style>
