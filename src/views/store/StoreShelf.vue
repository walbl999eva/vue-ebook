<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"/>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll"
    >
      <shelf-search/>
      <shelf-list :data="shelfList"/>
    </scroll>
    <shelf-footer/>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    data() {
      return {
        scrollBottom: 0
      }
    },
    watch: {
      isEditMode(v) {
        this.scrollBottom = v ? 48 : 0
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    components: { ShelfFooter, ShelfList, ShelfSearch, Scroll, ShelfTitle },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      this.getShelfList()
      this.setShelfCategory([])
      this.setCurrentType(1)
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
  }
</style>
