const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY(state, OffsetY) {
      state.hotSearchOffsetY = OffsetY
    },
    SET_FLAP_CARD_VISIBLE(state, visible) {
      state.flapCardVisible = visible
    }
  }
}

export default store
