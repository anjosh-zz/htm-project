<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><v-avatar
        class="white"
      >
        <img src="/logo1.png" alt="avatar">
      </v-avatar><span class="ml-2">{{title}}</span></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container class="pa-0">
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
    </v-footer>
  </v-app>
</template>

<script>
  const loggedInItems = [
    { icon: 'list', title: 'My Guest List', to: '/listguests' },
    { icon: 'add', title: 'Add Guest', to: '/addguest' },
    { icon: 'file_upload', title: 'Import Guests', to: '/importGuests' },
    { icon: 'exit_to_app', title: 'Logout', to: '/logout' }
  ]
  const loggedOutItems = []
  const sidebarItems = [
    { icon: 'apps', title: 'Welcome', to: '/' }
  ]

  export default {
    data () {
      return {
        clipped: true,
        drawer: false,
        fixed: false,
        miniVariant: false,
        title: 'MyTribe'
      }
    },
    computed: {
      items: function () {
        const itemsToAdd = this.$auth.loggedIn ? loggedInItems : loggedOutItems
        return sidebarItems.concat(itemsToAdd)
      }
    }
  }
</script>
