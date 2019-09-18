<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      fixed
      app
      :class="{ 'introjs-showElement': $store.state.introHighlightOnMenuItem }"
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
      <v-layout class="toolbar" row align-center>
        <v-flex class="toolbar-right">
          <v-layout class="header" row align-center>
            <v-flex>
              <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
            </v-flex>
            <v-flex v-if="showLogo" class="ml-2 mt-2 logo">
              <img src="/icon.png"/>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex class="toolbar-left">
          <v-text-field
            v-if="$route.path === '/listguests'"
            name="search"
            label="Search Contacts"
            append-icon="search"
            v-model="search"
            class="ml-3"
            single-line
          ></v-text-field>
        </v-flex>
      </v-layout>
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
      <v-spacer></v-spacer>
      <a class="mr-3" href="https://tribenet.co/privacy-policy/" target="_blank">Privacy Policy</a>
      <no-ssr>
        <cookie-law></cookie-law>
      </no-ssr>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapMutations } from 'vuex'
  import CookieLaw from 'vue-cookie-law'

  const loggedInItems = [
    { icon: 'apps', title: 'Dashboard', to: '/dashboard' },
    { icon: 'list', title: 'Contacts', to: '/listguests' },
    { icon: 'add', title: 'Add Contact', to: '/addguest' },
    { icon: 'email', title: 'Share Content', to: '/content' },
    { icon: 'file_upload', title: 'Import Contacts', to: '/importGuests' },
    { icon: 'contact_support', title: 'Contact Us', to: '/contactUs' },
    { icon: 'exit_to_app', title: 'Logout', to: '/logout' }
  ]
  const loggedOutItems = [
    { icon: 'apps', title: 'Welcome', to: '/' }
  ]
  const sidebarItems = [
  ]

  export default {
    components: { CookieLaw },
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
      },
      search: {
        get () {
          return this.$store.state.searchInput
        },
        set (value) {
          this.updateSearchInput(value)
        }
      },
      showLogo () {
        if (this.$route.path !== '/listguests') return true
        else if (this.$vuetify.breakpoint.smAndUp) return true
        else return this.$store.state.searchInput.length < 20
      }
    },
    methods: {
      ...mapMutations([
        'toggleDrawer',
        'updateDrawer',
        'updateSearchInput'
      ])
    }
  }
</script>

<style>
  .privacy-policy {
    text-align: right;
  }
</style>

<style scoped>
  .toolbar {
    height: 100%; 
    width: 100%;
    justify-content: space-between;
    margin-left: -12px;
  }
  .toolbar-right {
    height: 100%; 
    flex: 0 1 auto;
  }
  .header {
    height: 100%; 
    width: fit-content;
  }
  .logo {
    height: 70%;
  }
  .logo img {
    height: 100%;
  }
  .toolbar-left {
    max-width: 700px;
  }
</style>