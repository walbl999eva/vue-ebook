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
    <flap-card :data="random"/>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'
  import { home } from '../../api/store'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    data() {
      return {
        scrollTop: 94,
        random: null
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
    },
    mounted () {
      home().then(res => {
        if (res && res.status === 200) {
          const data = res.data
          const randomIndex = Math.floor(Math.random() * data.random.length)
          this.random = data.random[randomIndex]
        }
      })
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
