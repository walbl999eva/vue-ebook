<template>
  <div class="cover-title-wrapper">
    <div class="cover-title-left-wrapper">
      <img class="cover-img" :src="cover">
    </div>
    <div class="cover-title-right-wrapper">
      <div class="detail-cover-title-wrapper">
        <div class="cover-title-text">{{title}}</div>
      </div>
      <div class="cover-author-wrapper">
        <div class="cover-author-text">{{author}}</div>
      </div>
      <div class="detail-cover-description-wrapper">
        <div class="detail-cover-description-text">{{desc}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      cover: String,
      title: String,
      author: String,
      desc: String
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .cover-title-wrapper {
    display: flex;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    .cover-title-left-wrapper {
      flex: 0 0 118px;
      width: 118px;
      padding: 10px 0 10px 15px;
      box-sizing: border-box;
      @include top;
      .cover-img {
        /*width: 100%;*/
        width: 103px;
        height: 146px;
      }
    }
    .cover-title-right-wrapper {
      flex: 1;
      padding: 10px 15px;
      box-sizing: border-box;
      overflow: hidden;
      .detail-cover-title-wrapper {
        .cover-title-text {
          font-size: 24px;
          line-height: 26px;
          font-weight: bold;
          color: #333;
          @include multiline-ellipsis(3);
        }
      }
      .cover-author-wrapper {
        margin-top: 10px;
        .cover-author-text {
          font-size: 14px;
          line-height: 16px;
          color: $color-blue;
          @include multiline-ellipsis(2);
        }
      }
      .detail-cover-description-wrapper {
        margin-top: 10px;
        .detail-cover-description-text {
          font-size: 14px;
          line-height: 16px;
          color: #666;
          @include multiline-ellipsis(4);
        }
      }
    }
  }
</style>
