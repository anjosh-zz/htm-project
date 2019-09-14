export const state = () => ({
  tutorial: false,
  drawer: false,
  introHighlightOnMenuItem: false,
  searchInput: ''
})

export const mutations = {
  startTutorial (state) {
    state.tutorial = true
  },
  endTutorial (state) {
    state.tutorial = false
  },
  toggleDrawer (state) {
    state.drawer = !state.drawer
  },
  updateDrawer (state, value) {
    state.drawer = value
  },
  updateIntroHighlightOnMenuItem (state, value) {
    state.drawer = value
    state.introHighlightOnMenuItem = value
  },
  updateSearchInput (state, value) {
    state.searchInput = value
  }
}
