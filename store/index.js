export const state = () => ({
  tutorial: false,
  drawer: false
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
  openDrawer (state) {
    state.drawer = true
  },
  closeDrawer (state) {
    state.drawer = false
  },
  updateDrawer (state, value) {
    state.drawer = value
  }
}
