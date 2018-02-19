<template>
  <v-layout row align-center justify-center class="guestPage pa-0">
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="headline pb-2">
          <v-container fluid class="pa-0">
            <v-layout row>
              <v-flex xs-6 class="pt-2">
                Collaborators
              </v-flex>
              <v-flex xs-6 class="text-xs-right">
                <v-btn color="primary" @click.native="setupAddCollaborator">Add Collaborator</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container fluid class="pa-0">
            <v-layout row>
              <v-flex xs-12 class="px-3">
                <v-text-field
                  name="search"
                  label="Search collaborators..."
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
                      <v-list-tile-avatar>
                        <img v-bind:src="collaborator.Person.avatar" v-if="collaborator.Person.avatar">
                        <img v-bind:src="collaborator.Person.avatarURL" v-else-if="collaborator.Person.avatarURL">
                        <div v-bind:class="[item.colorClassName, 'letter']" v-else>
                          <span class="white--text headline">{{collaborator.Person.fullname.charAt(0)}}</span>
                        </div>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="collaborator.Person.fullname"></v-list-tile-title>
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
  import axios from '~/plugins/axios'

  const searchApi = new SearchApi()
  let collaborators = []

  export default {
    middleware: 'auth',
    components: {Profile},
    fetch () {
      return axios.get('/users/collaborators')
        .then((response) => {
          collaborators = response.data
        })
    },
    created () {
      collaborators.forEach((collaborator, index) => {
        searchApi.indexDocument(index, collaborator.Person.fullname)
        if (!collaborator.Person.avatar) {
          collaborator.Person.colorClassName = toMaterialStyle(collaborator.Person.fullname).materialColorName.toLowerCase()
        }
      })

      this.getItems(collaborators.slice(0))
    },
    data () {
      return {
        items: [],
        person: {},
        profileIsShowing: false
      }
    },
    methods: {
      setupAddCollaborator () {
      },
      search (input) {
        return searchApi.search(input)
          .then((results) => {
            return this.getItems(results.map(index => collaborators[index]))
          })
      },
      getItems (collaboratorsToDisplay) {
        this.items = []
        if (collaboratorsToDisplay.length) {
          collaboratorsToDisplay.forEach((collaborator, index) => {
            if (index > 0) {
              this.items.push({ divider: true, inset: false })
            }
            this.items.push(collaborator)
          })
        } else {
          this.items.push({ header: 'No collaborators to display' })
        }
      }
    }
  }
</script>
