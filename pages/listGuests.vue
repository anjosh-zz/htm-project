<template>
  <v-layout row class="guestPage pa-0">
    <v-flex xs12 sm6 offset-sm3>
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
                    <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                    <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                    <v-list-tile avatar v-else @click="">
                      <v-list-tile-avatar>
                        <img v-bind:src="item.avatar" v-if="item.avatar">
                        <div v-bind:class="[item.colorClassName, 'letter']" v-else>
                          <span class="white--text headline">{{item.name.charAt(0)}}</span>
                        </div>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="item.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="item.importance"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import SearchApi from 'js-worker-search'
  const toMaterialStyle = require('material-color-hash') // this module is built weirdly

  const searchApi = new SearchApi()
  let guests = []

  export default {
    middleware: 'auth',
    created () {
      guests = [
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg', name: 'John Smith', importance: "It's going to be this guy's birthday" },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg', name: "George O'Hara", importance: 'This guy needs to go to some event' },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg', name: 'Sandra Adams', importance: 'This person is doing well' },
        { avatar: '', name: 'Ali Connors', importance: 'This person is doing well' }
      ]

      guests.forEach((guest, index) => {
        searchApi.indexDocument(index, guest.name)
        if (!guest.avatar) {
          guest.colorClassName = toMaterialStyle.default(guest.name).materiaColorName.toLowerCase() // really weirdly, hence .default and materiaColorName
        }
      })

      this.getItems(guests.slice(0))
    },
    data () {
      return {
        items: []
      }
    },
    methods: {
      search (input) {
        return searchApi.search(input)
          .then((results) => {
            return this.getItems(results.map(index => guests[index]))
          })
      },
      getItems (guestsToDisplay) {
        this.items = []
        if (guestsToDisplay.length) {
          guestsToDisplay.forEach((guest, index) => {
            if (index > 0) {
              this.items.push({ divider: true, inset: true })
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
