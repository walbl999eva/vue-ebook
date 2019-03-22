<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list">
      <div class="shelf-item-category-item"
           v-for="item in data.itemList"
           :key="item.id"
      >
        <img :src="item.cover" class="shelf-item-category-img">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ShelfItemCategory',
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item-category{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-item-category-list{
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      height: 100%;
      padding-top: 5px;
      box-sizing: border-box;
      .shelf-item-category-item{
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        box-sizing: border-box;
        &:nth-child(3n+1){
          padding: 0 2.5px 5px 5px;
        }
        &:nth-child(3n){
          padding: 0 5px 5px 2.5px;
        }
        &:nth-child(3n+2){
          padding: 0 2.5px 5px 2.5px;
        }
        .shelf-item-category-img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
