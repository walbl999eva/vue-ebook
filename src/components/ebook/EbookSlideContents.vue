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
               @keyup.enter.exact="search()"
               v-model="searchText"
        >
      </div>
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage()"
      >
        {{$t('book.cancel')}}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
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
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            v-show="!searchVisible"
    >
      <div class="slide-contents-item"
           v-for="(item,index) in navigation"
           :key="index"
      >
        <span class="slide-contents-item-label"
              :style="contentItemStyle(item)"
              :class="{'selected':section===index}"
              @click="displayContent(item.href)"
        >
          {{item.label}}
        </span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list"
            v-show="searchVisible"
            :top="66"
            :bottom="48"
    >
      <div class="slide-search-item"
           v-for="(item,index) in searchList"
           :key="index"
           v-html="item.excerpt"
           @click="displayContent(item.cfi,true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { px2rem } from '../../utils/utils'
  import Scroll from '../common/Scroll'

  export default {
    name: 'EbookSlideContents',
    mixins: [ebookMixin],
    data() {
      return {
        searchVisible: false,
        searchList: null,
        searchText: ''
      }
    },
    methods: {
      search() {
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then(list => {
            this.searchList = list
            let reg = new RegExp(this.searchText, 'gi')
            this.searchList.map(item => {
              let matchText = reg.exec(item.excerpt)
              item.excerpt = item.excerpt.replace(reg, `<span class="content-search-text">${matchText}</span>`)
              return item
            })
          })
        }
      },
      doSearch(q) {
        return Promise.all(
          this.currentBook.spine.spineItems
            .map(section => section.load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results)))
      },
      displayContent(target, highlight = false) {
        this.display(target, () => {
          this.hideTitleAndMenu()
          // 将target高亮
          if (highlight) {
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      showSearchPage() {
        this.searchVisible = true
      },
      hideSearchPage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = null
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      }
    },
    components: {
      Scroll
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
    .slide-contents-list{
      padding: 0 15px;
      box-sizing: border-box;
      .slide-contents-item{
        display: flex;
        padding: 18px 0;
        .slide-contents-item-label{
          flex: 1;
          line-height: 16px;
          font-size: 14px;
          @include ellipsis;
        }
        .slide-contents-item-page{}
      }
    }
    .slide-search-list{
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      .slide-search-item{
        font-size: 14px;
        line-height: 16px;
        padding: 20px 0;
        box-sizing: border-box;
      }
    }
  }

</style>
