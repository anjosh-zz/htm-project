<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row align-center>
    <v-flex xs12>
      <v-btn
          fixed
          dark
          fab
          bottom
          right
          color="primary"
          class="mb-5 mr-2"
          nuxt
          to="/addguest"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline pb-2">
          <span>Guests</span>
          <v-spacer></v-spacer>
          <v-text-field
              name="search"
              label="Search"
              append-icon="search"
              v-model="search"
              single-line
          ></v-text-field>
          <v-btn v-if="selected.length > 0" icon @click="emailGuests">
            <v-icon>email</v-icon>
          </v-btn>
        </v-card-title>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            select-all
            class="mi-datatable elevation-1"
            :pagination.sync="pagination"
            hide-actions
            :search="search"
        >
          <template v-slot:items="props">
            <v-hover>
              <template v-slot="{ hover }">
                <tr @click="showProfile(props.item)">
                  <td @click.stop>
                    <v-checkbox
                        v-if="hover || props.selected"
                        v-model="props.selected"
                        primary
                        hide-details
                    ></v-checkbox>
                    <v-avatar v-else :color="props.item.colorClassName" size="40">
                      <Avatar :person="props.item"/>
                    </v-avatar>
                  </td>
                    <td>{{ props.item.fullname }}</td>
                    <template v-if="$vuetify.breakpoint.smAndUp">
                      <td>{{ props.item.email }}</td>
                      <td>{{ props.item.phoneNumber | phoneNumberFilter }}</td>
                      <td>{{ props.item.notes }}</td>
                      <td v-if="hover" class="justify-center align-center layout px-0">
                        <v-btn icon class="ma-0" @click.stop="showDeleteDialog(props.item)">
                          <v-icon color="grey">delete</v-icon>
                        </v-btn>
                        <v-btn icon class="ma-0" @click.stop="editProfile(props.item.id)">
                          <v-icon color="grey">edit</v-icon>
                        </v-btn>
                      </td>
                      <td v-else>{{ props.item.createdAt | moment }}</td>
                    </template>
                </tr>
              </template>
            </v-hover>
          </template>
        </v-data-table>
        <Profile
            :showProfile="profileIsShowing"
            :person="person"
            v-on:close="hideProfile"
            v-on:edit="editProfile"
            v-on:delete="showDeleteDialog"
        >
        </Profile>
        <v-dialog v-model="deleteDialogIsShowing" max-width="360px">
          <v-card>
            <v-card-title primary-title class="title">
              Delete this contact?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="hideDeleteDialog" flat>
                Cancel
              </v-btn>
              <v-btn @click="deleteProfile" flat color="red">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import moment from 'moment'
  import { mapMutations } from 'vuex'
  import toMaterialStyle from 'material-color-hash'
  import googlePhoneNumberLib from 'google-libphonenumber'
  import Profile from '~/components/personProfile.vue'
  import Avatar from '~/components/personAvatar.vue'

  const phoneUtil = googlePhoneNumberLib.PhoneNumberUtil.getInstance()
  const PNF = googlePhoneNumberLib.PhoneNumberFormat

  export default {
    components: {Profile, Avatar},
    created () {
      this.getGuests()
    },
    data () {
      return {
        search: '',
        selected: [],
        pagination: {
          rowsPerPage: -1
        },
        items: [],
        person: {},
        profileIsShowing: false,
        deleteDialogIsShowing: false
      }
    },
    computed: {
      headers () {
        const nameHeader = { text: 'Name', value: 'fullname', align: 'left', width: '100%' }
        if (this.$vuetify.breakpoint.xsOnly) {
          return [nameHeader]
        } else {
          return [
            { ...nameHeader, width: '15%' },
            { text: 'Email', value: 'email', width: '20%' },
            { text: 'Phone number', value: 'phoneNumber', width: '15%' },
            { text: 'Notes', value: 'notes', width: '40%' },
            { text: 'Date Added', value: 'createdAt', width: '10%' }
          ]
        }
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
      async getGuests () {
        this.items = await this.$axios.$get('/persons/guests')
        this.items.forEach(guest => {
          if (!guest.avatar) {
            guest.colorClassName = toMaterialStyle(guest.fullname).materialColorName.toLowerCase()
            guest.firstLetter = guest.fullname.charAt(0)
          }
        })
      },
      showDeleteDialog (item) {
        this.person = item
        this.deleteDialogIsShowing = true
      },
      hideDeleteDialog () {
        this.deleteDialogIsShowing = false
      },
      async deleteProfile () {
        await this.$axios.$delete('/persons/' + this.person.id)
        this.hideDeleteDialog()
        this.hideProfile()
        await this.getGuests()
      },
      emailGuests () {
        this.$router.push({
          name: 'emailTemplates',
          params: {
            people: this.selected
          }
        })
      },
      ...mapMutations({
        toggleListGuestsSort: 'toggleListGuestsSort'
      })
    },
    filters: {
      moment: function (date) {
        return moment(date).format('MM/DD/YYYY')
      },
      phoneNumberFilter: function (phoneNumber) {
        if (phoneNumber) {
          const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'US')
          return phoneUtil.format(number, PNF.NATIONAL)
        }
      }
    }
  }
</script>

<style>
  table.v-table tbody td {
    font-size: 15px;
    height: 60px
  }
  .v-datatable .v-input--selection-controls {
    margin-left: 10px;
  }
  table.v-table tbody tr {
    cursor: pointer;
  }
  .theme--light.v-table tbody tr:not(:last-child) {
    border-bottom: 0
  }
</style>
