<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClicked,'hide-shadow':ifHideShadow}">
    <div class="shelf-search" :class="{'search-top':ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input type="text" class="search-input"
                 :placeholder="$t('shelf.search')"
                 @click="onSearchClick"
                 v-model="searchText"
          >
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length>0"
             @click="clearSearchText"
        >
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper"
           v-if="!ifInputClicked"
           @click="switchLocale"
      >
        <span class="icon-cn icon" v-if="lang ==='cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" v-else @click="onCancelClick">
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div class="shelf-search-tab-item"
             v-for="item in tabs"
             :key="item.id"
             @click="onTabClick(item.id)"
        >
          <span class="shelf-search-tab-text" :class="{'is-selected':selectedTab===item.id}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { setLocalStroage } from '../../utils/localStorage'
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfSearch',
    mixins: [storeShelfMixin],
    data() {
      return {
        ifInputClicked: false,
        ifHideShadow: true,
        searchText: '',
        selectedTab: 1
      }
    },
    watch: {
      offsetY(v) {
        if (v > 0 && this.ifInputClicked) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      lang() {
        return this.$i18n.locale
      },
      tabs() {
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    methods: {
      onTabClick(id) {
        this.selectedTab = id
      },
      clearSearchText() {
        this.searchText = ''
      },
      onSearchClick() {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick() {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      },
      switchLocale() {
        if (this.lang === 'en') {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        setLocalStroage('locale', this.$i18n.locale)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .shelf-search-wrapper{
    position: relative;
    z-index: 105;
    width: 100%;
    height: 94px;
    font-size: 16px;
    background: #fff;
    box-shadow: 0 2px 2px rgba(0,0,0,.1);
    &.hide-shadow{
      box-shadow: none;
    }
    &.search-top{
      position: fixed;
      top: 0;
      left: 0;
    }
    .shelf-search{
      position: absolute;
      top: 42px;
      left: 0;
      width: 100%;
      height: 52px;
      z-index: 105;
      display: flex;
      transition: top $animationTime linear;
      &.search-top{
        top: 0;
      }
      .search-wrapper{
        display: flex;
        flex: 1;
        margin: 8px 0 8px 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        .icon-search-wrapper{
          flex: 0 0 22px;
          @include right;
          .icon-search{
            font-size: 12px;
          }
        }
        .search-input-wrapper{
          flex: 1;
          padding: 0 10px;
          box-sizing: border-box;
          @include center;
          .search-input{
            width: 100%;
            font-size: 14px;
            border: none;
            color: #333;
            &:focus{
              outline: none;
            }
            &::-webkit-input-placeholder{
              font-size: 14px;
              color: #ccc;
            }
          }
        }
        .icon-clear-wrapper{
          flex: 0 0 24px;
          @include left;
          .icon-close-circle-fill{
            font-size: 14px;
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper{
        flex: 0 0 55px;
        @include center;
        .icon-cn,.icon-en{
          font-size: 22px;
          color: #666;
        }
      }
      .cancel-btn-wrapper{
        flex: 0 0 55px;
        @include center;
        .cancel-text{
          font-size: 14px;
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper{
      position: absolute;
      top: 52px;
      left: 0;
      z-index: 105;
      display: flex;
      width: 100%;
      height: 42px;
      .shelf-search-tab-item{
        flex: 1;
        @include center;
        .shelf-search-tab-text{
          font-size: 12px;
          color: #999;
          &.is-selected{
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
