<template>
  <div class="store-home">
    <search-bar/>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
      <div>11111111111111</div>
    </scroll>
    <flap-card/>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    data() {
      return {
        scrollTop: 94
      }
    },
    components: {
      SearchBar,
      Scroll,
      FlapCard
    },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .store-home{
    width: 100%;
    height: 100%;
  }
</style>
