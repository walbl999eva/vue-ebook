<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"/>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
            v-if="ifShowList"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"/>
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      {{$t('shelf.groupNone')}}
    </div>
    <shelf-footer/>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    components: { ShelfFooter, ShelfList, Scroll, ShelfTitle },
    data() {
      return {
        scrollBottom: 0
      }
    },
    watch: {
      isEditMode(v) {
        this.scrollBottom = v ? 48 : 0
        if (this.$refs.scroll) {
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }
      }
    },
    computed: {
      ifShowList() {
        return this.shelfCategory && this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      this.getShelfCategoryList(this.$route.query.title)
      this.setCurrentType(2)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf{
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 100;
    .store-shelf-scroll-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
    .store-shelf-empty-view{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #333;
      @include center;
    }
  }
</style>
