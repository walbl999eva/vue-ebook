<template>
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible,'hide-shadow':!shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper"
           :class="{'hide-title':!titleVisible}"
           @click="back"
      >
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title':!titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title':!titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text" class="input"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
                 @keyup.enter.exact="search"
          >
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearchList"/>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import HotSearchList from './HotSearchList'

  export default {
    name: 'SearchBar',
    mixins: [storeHomeMixin],
    data() {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false,
        hotSearchVisible: false
      }
    },
    components: {
      HotSearchList
    },
    watch: {
      offsetY(v) {
        if (v > 0) {
          this.hideTitle()
          this.showShadow()
        } else if (v === 0) {
          this.showTitle()
          this.hideShadow()
        }
      },
      hotSearchOffsetY(v) {
        if (v > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
      }
    },
    methods: {
      search() {
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
      },
      showFlapCard() {
        this.setFlapCardVisible(true)
      },
      back() {
        if (this.offsetY > 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
        if (this.hotSearchVisible) {
          this.hideHotSearch()
        } else {
          this.$router.push('/store/shelf')
        }
      },
      hideHotSearch() {
        this.hotSearchVisible = false
        if (this.offsetY > 0) {
          this.hideTitle()
        } else {
          this.showTitle()
        }
      },
      showHotSearch() {
        this.hideTitle()
        this.hideShadow()
        this.hotSearchVisible = true
        // Vue DOM操作完成后再调用方法
        this.$nextTick(() => {
          this.$refs.hotSearchList.reset()
        })
      },
      hideTitle() {
        this.titleVisible = false
      },
      showTitle() {
        this.titleVisible = true
      },
      hideShadow() {
        this.shadowVisible = false
      },
      showShadow() {
        this.shadowVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .search-bar{
    position: relative;
    width: 100%;
    height: 94px;
    z-index: 150;
    box-shadow: 0 2px 2px rgba(0,0,0,.1);
    &.hide-title{
      height: 52px;
    }
    &.hide-shadow{
      box-shadow: none;
    }
    .search-bar-title-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 42px;
      .title-text-wrapper{
        width: 100%;
        height: 42px;
        @include center;
      }
      .title-icon-shake-wrapper{
        position: absolute;
        right: 15px;
        top: 0;
        height: 42px;
        @include center;
      }
    }
    .title-icon-back-wrapper{
      position: absolute;
      left: 15px;
      top: 0;
      height: 42px;
      z-index: 200;
      transition: height $animationTime $animationType;
      @include center;
      &.hide-title{
        height: 52px;
      }
    }
    .search-bar-input-wrapper{
      position: absolute;
      top: 42px;
      left: 0;
      display: flex;
      width: 100%;
      height: 52px;
      padding: 10px;
      box-sizing: border-box;
      transition: top $animationTime $animationType;
      &.hide-title{
        top: 0;
      }
      .search-bar-blank{
        flex: 0 0 0 ;
        width: 0;
        transition: flex $animationTime $animationType,width $animationTime $animationType;
        &.hide-title{
          flex: 0 0 31px;
          width: 31px;
        }
      }
      .search-bar-input{
        flex: 1;
        width: 100%;
        border-radius: 20px;
        background: #f4f4f4;
        padding: 5px 15px;
        box-sizing: border-box;
        border: 1px solid #eee;
        @include  left;
        .icon-search{
          color: #999;
        }
        .input{
          width: 100%;
          height: 22px;
          border: none;
          background: transparent;
          margin-left: 10px;
          font-size: 12px;
          color: #666;
          &:focus{
            outline: none;
          }
          &::-webkit-input-placeholder{
            color: #ccc;
          }
        }
      }
    }
  }
</style>
