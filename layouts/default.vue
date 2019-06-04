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
    <v-footer :fixed="fixed" :height="56" app>
      <a width="150" height="50" href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank"
         alt="Single Sign On & Token Based Authentication - Auth0">
        <img width="150" height="50"
             alt="JWT Auth for open source projects"
             src="//cdn.auth0.com/oss/badges/a0-badge-light.png"/>
      </a>
    </v-footer>
  </v-app>
</template>

<script>
  const loggedInItems = [
    { icon: 'apps', title: 'Dashboard', to: '/dashboard' },
    { icon: 'list', title: 'My Guest List', to: '/listguests' },
    { icon: 'add', title: 'Add Guest', to: '/addguest' },
    { icon: 'email', title: 'Email Templates', to: '/emailTemplates' },
    { icon: 'file_upload', title: 'Import Guests', to: '/importGuests' },
    { icon: 'feedback', title: 'Feedback', to: '/feedback' },
    { icon: 'exit_to_app', title: 'Logout', to: '/logout' }
  ]
  const loggedOutItems = [
    { icon: 'apps', title: 'Welcome', to: '/' }
  ]
  const sidebarItems = [
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
