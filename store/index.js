const loggedInItems = [
  { icon: 'list', title: 'My Guest List', to: '/listguests', loggedInItem: true },
  { icon: 'add', title: 'Add Guest', to: '/addguest', loggedInItem: true },
  { icon: 'exit_to_app', title: 'Logout', to: '/logout', loggedInItem: true }
]
const loggedOutItems = [
  { icon: 'arrow_forward', title: 'Login', to: '/login', loggedOutItem: true }
]
export const state = () => ({
  sidebar: false,
  loggedIn: false,
  sidebarItems: [
    { icon: 'apps', title: 'Welcome', to: '/' },
    { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' },
    ...loggedOutItems
  ]
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  toggleLoggedIn (state) {
    state.loggedIn = !state.loggedIn
    if (state.loggedIn) {
      state.sidebarItems = state.sidebarItems.filter(item => !item.loggedOutItem).concat(loggedInItems)
    } else {
      state.sidebarItems = state.sidebarItems.filter(item => !item.loggedInItem).concat(loggedOutItems)
    }
  }
}

export const getters = {
  getSidebarItems: state => state.sidebarItems
}
