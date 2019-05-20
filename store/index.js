export const state = () => ({
  listGuestsByDateAdded: false
})

export const mutations = {
  toggleListGuestsSort (state) {
    state.listGuestsByDateAdded = !state.listGuestsByDateAdded
  }
}
