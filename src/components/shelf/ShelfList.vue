<template>
  <div class="shelf-list" :style="{top:shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div v-for="item in data" :key="item.id"
           class="shelf-list-item-wrapper"
      >
        <shelf-item :data="item" :style="{height:itemHeight}"/>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx, px2rem } from '../../utils/utils'

  export default {
    name: 'ShelfList',
    components: { ShelfItem },
    mixins: [storeShelfMixin],
    props: {
      top: {
        type: Number,
        default: 94
      },
      data: Array
    },
    computed: {
      itemHeight() {
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      },
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .shelf-list{
    position: absolute;
    /*top: 94px;*/
    left: 0;
    width: 100%;
    z-index: 100;
    #shelf-list{
      display: flex;
      flex-flow: row wrap;
      padding: 0 15px;
      box-sizing: border-box;
      .shelf-list-item-wrapper{
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: 15px;
        box-sizing: border-box;
        &.list-leave-active{
          display: none;
        }
        &.list-move{
          transition: transform .5s;
        }
        .shelf-list-title-wrapper{
          margin-top: 10px;
        }
      }
    }
  }
</style>
