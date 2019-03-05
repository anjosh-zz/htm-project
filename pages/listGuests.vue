<template>
  <v-layout row align-center justify-center class="guestPage pa-0">
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="headline pb-2">Guests</v-card-title>
        <v-card-text class="pa-0">
          <v-container fluid class="pa-0">
            <v-layout row>
              <v-flex xs-12 class="px-3">
                <v-text-field
                  name="search"
                  label="Search guests..."
                  append-icon="search"
                  @input="search"
                  single-line
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs-12>
                <v-list two-line>
                  <template v-for="item in items">
                    <v-subheader v-if="item.header" v-text="item.header" class="px-3"></v-subheader>
                    <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                    <v-list-tile avatar v-else @click="showProfile(item)">
                      <v-list-tile-avatar :color="item.colorClassName">
                        <Avatar :person="item"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="item.fullname"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="item.importance"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-layout>
            <Profile
              :showProfile="profileIsShowing"
              :person="person"
              v-on:close="hideProfile"
              v-on:edit="editProfile"
            >
            </Profile>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import SearchApi from 'js-worker-search'
  import toMaterialStyle from 'material-color-hash'
  import Profile from '~/components/personProfile.vue'
  import Avatar from '~/components/personAvatar.vue'

  const searchApi = new SearchApi()

  export default {
    components: {Profile, Avatar},
    async asyncData ({ $axios }) {
      const response = await $axios.$get('/persons/guests')
      return { guests: response }
    },
    created () {
      this.guests.forEach((guest, index) => {
        searchApi.indexDocument(index, guest.fullname)
        if (!guest.avatar) {
          guest.colorClassName = toMaterialStyle(guest.fullname).materialColorName.toLowerCase()
          guest.firstLetter = guest.fullname.charAt(0)
        }
      })

      this.getItems(this.guests.slice(0))
    },
    data () {
      return {
        items: [],
        person: {},
        profileIsShowing: false
      }
    },
    methods: {
      showProfile (item) {
        this.person = item
        this.profileIsShowing = true
      },
      hideProfile () {
        this.profileIsShowing = false
      },
      editProfile (personId) {
        this.hideProfile()
        this.$router.push({
          name: 'editGuest',
          params: {
            personId: personId
          }
        })
      },
      search (input) {
        return searchApi.search(input)
          .then((results) => {
            return this.getItems(results.map(index => this.guests[index]))
          })
      },
      getItems (guestsToDisplay) {
        this.items = []
        if (guestsToDisplay.length) {
          guestsToDisplay.forEach((guest, index) => {
            if (index > 0) {
              this.items.push({ divider: true, inset: false })
            }
            this.items.push(guest)
          })
        } else {
          this.items.push({ header: 'No guests to display' })
        }
      }
    }
  }
</script>
