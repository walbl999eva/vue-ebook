<template>
  <div class="shelf-item" :class="{'shelf-item-shadow':data.type!==3}"
       @click="onItemClick"
  >
    <component :is="item" :data="data"
               class="shelf-item-comp"
               :class="{'is-edit':isEditMode && data.type===2}"
    />
    <div class="icon-selected"
         :class="{'is-selected':data.selected}"
         v-show="isEditMode && data.type===1"
    ></div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItemBook from './ShelfItemBook'
  import ShelfItemCategory from './ShelfItemCategory'
  import ShelfItemAdd from './ShelfItemAdd'
  import { goStoreHome } from '../../utils/store'

  export default {
    name: 'ShelfItem',
    components: { ShelfItemAdd, ShelfItemCategory, ShelfItemBook },
    mixins: [storeShelfMixin],
    data() {
      return {
        book: ShelfItemBook,
        category: ShelfItemCategory,
        add: ShelfItemAdd
      }
    },
    props: {
      data: Object
    },
    computed: {
      item() {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    methods: {
      onItemClick() {
        if (this.isEditMode) {
          if (this.data.type === 2 || this.data.type === 3) return
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (this.data.type === 1) {
            this.showBookDetail(this.data)
          } else if (this.data.type === 2) {
            this.$router.push({
              path: '/store/category',
              query: {
                title: this.data.title
              }
            })
          } else {
            goStoreHome(this)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &.shelf-item-shadow{
      box-shadow: 2px 2px 6px 2px rgba(200,200,200,.3);
    }
    .shelf-item-comp{
      opacity: 1;
      &.is-edit{
        opacity: .5;
      }
    }
    .icon-selected{
      position: absolute;
      bottom: 2px;
      right: 2px;
      font-size: 18px;
      color: rgba(243, 255, 251, 0.4);
      &.is-selected{
        color: $color-blue;
      }
    }
  }
</style>
