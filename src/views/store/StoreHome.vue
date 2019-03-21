<template>
  <div class="store-home">
    <search-bar/>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"/>
      <recommend :data="recommend" class="recommend"/>
      <featured :data="featured" class="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" :titleVisible="true"/>
      <div class="category-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <category-book :data="item"/>
      </div>
      <category :data="categories" class="categories"/>
    </scroll>
    <flap-card :data="random"/>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import GuessYouLike from '../../components/home/GuessYouLike'
  import { storeHomeMixin } from '../../utils/mixin'
  import { home } from '../../api/store'
  import Recommend from '../../components/home/Recommend'
  import Featured from '../../components/home/Featured'
  import Category from '../../components/home/Category'
  import CategoryBook from '../../components/home/CategoryBook'

  export default {
    name: 'StoreHome',
    mixins: [storeHomeMixin],
    data() {
      return {
        scrollTop: 94,
        random: null,
        banner: null,
        guessYouLike: null,
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    components: {
      CategoryBook,
      Category,
      Featured,
      Recommend,
      SearchBar,
      Scroll,
      FlapCard,
      GuessYouLike
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
          console.log(data)
          const randomIndex = Math.floor(Math.random() * data.random.length)
          this.random = data.random[randomIndex]
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.categoryList = data.categoryList
          this.categories = data.categories
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
    .banner-wrapper{
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      .banner-img{
        width: 100%;
        height: 150px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend{
      margin-top: 20px;
    }
    .featured{
      margin-top: 20px;
    }
    .category-list-wrapper{
      margin-top: 20px;
    }
    .categories{
      margin-top: 20px;
    }
  }
</style>
