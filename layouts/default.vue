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
      <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
      <v-img src="/myTribe_BW_Logo_v1.png" height="70%" contain position="left center" class="ml-2 mt-2"/>
    </v-toolbar>
    <v-content>
      <v-container fluid class="pa-0">
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
  import { mapMutations } from 'vuex'

  const loggedInItems = [
    { icon: 'apps', title: 'Dashboard', to: '/dashboard' },
    { icon: 'list', title: 'Contacts', to: '/listguests' },
    { icon: 'add', title: 'Add Contact', to: '/addguest' },
    { icon: 'email', title: 'Email Templates', to: '/emailTemplates' },
    { icon: 'file_upload', title: 'Import Contacts', to: '/importGuests' },
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
        fixed: false,
        miniVariant: false,
        title: 'MyTribe'
      }
    },
    computed: {
      items: function () {
        const itemsToAdd = this.$auth.loggedIn ? loggedInItems : loggedOutItems
        return sidebarItems.concat(itemsToAdd)
      },
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (value) {
          this.updateDrawer(value)
        }
      }
    },
    methods: {
      ...mapMutations([
        'toggleDrawer',
        'updateDrawer'
      ])
    }
  }
</script>
