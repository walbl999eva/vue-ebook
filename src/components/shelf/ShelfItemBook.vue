<template>
  <div class="shelf-item-book">
    <img class="shelf-item-book-cover" :src="data.cover">
    <div class="private-wrapper" v-show="data.private"></div>
    <div class="private-bg-wrapper" v-show="data.private"></div>
    <div class="private-icon-wrapper" v-show="data.private">
      <span class="icon-private"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-book {
    width: 100%;
    height: 100%;
    .shelf-item-book-cover {
      width: 100%;
      height: 100%;
    }
    .private-wrapper {
      display: none;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-width: 17px;
      border-style: solid;
      border-color: transparent transparent #fff #fff;
    }
    .private-bg-wrapper{
      position: absolute;
      left: -26px;
      bottom: -25px;
      width: 50px;
      height: 50px;
      transform: rotate(45deg);
      background: #fff;
      box-shadow: 0 -1px 2px rgba(0,0,0,.2);
    }
    .private-icon-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 30px;
      height: 30px;
      padding-bottom: 4px;
      padding-left: 3px;
      @include leftBottom;
      .icon-private {
        font-size: 14px;
        color: $color-blue;
      }
    }
  }
</style>
