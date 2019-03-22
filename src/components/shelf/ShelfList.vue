<template>
  <div class="shelf-list">
    <div v-for="item in shelfList" :key="item.id"
         class="shelf-list-item-wrapper"
    >
      <shelf-item :data="item" :style="{height:itemHeight}"/>
      <div class="shelf-list-title-wrapper">
        <span class="shelf-list-title title-small">{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx } from '../../utils/utils'

  export default {
    name: 'ShelfList',
    components: { ShelfItem },
    mixins: [storeShelfMixin],
    computed: {
      itemHeight() {
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .shelf-list{
    position: absolute;
    top: 94px;
    left: 0;
    z-index: 100;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    .shelf-list-item-wrapper{
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: 15px;
      box-sizing: border-box;
      .shelf-list-title-wrapper{
        margin-top: 10px;
      }
    }
  }
</style>
