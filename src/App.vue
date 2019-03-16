<template>
  <div id="app">
    <span class="text">asdfASDgh</span>
    <router-view/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const getters = {
    a: () => 1,
    b: () => 2
  }
  function fn(keys) {
    const data = {}
    keys.forEach(key => {
      if (getters.hasOwnProperty(key)) {
        data[key] = getters[key]
      }
    })
    return data
  }
  export default {
    computed: {
      ...mapGetters(['test']),
      ...fn(['a', 'b', 'c'])
    },
    mounted() {
      // this.$store.dispatch('setTest', 7).then(() => {
      //   // console.log(this.$store.state.book.test)
      //   console.log(this.test)
      // })
      console.log(this.a, this.b, this.c)
    }
  }
</script>

<style scoped lang="scss">
  @import "./assets/styles/global";
  .text{
    font-family: 'Days One';
    font-size: 20px;
    color: orange;
  }
</style>
