const loggedInItems = [
  { icon: 'list', title: 'My Guest List', to: '/listguests' },
  { icon: 'add', title: 'Add Guest', to: '/addguest' },
  { icon: 'file_upload', title: 'Import Guests', to: '/importGuests' },
  { icon: 'exit_to_app', title: 'Logout', to: '/logout' }
]

export const state = () => ({
  sidebar: false,
  loggedIn: false,
  sidebarItems: []
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  toggleLoggedIn (state) {
    state.loggedIn = !state.loggedIn
    if (state.loggedIn) {
      state.sidebarItems = loggedInItems
    }
  }
}

export const getters = {
  getSidebarItems: state => state.sidebarItems
}
