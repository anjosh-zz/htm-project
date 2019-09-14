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
          class="add-contact-btn mb-5 mr-2"
          nuxt
          to="/addguest"
          @click="exitTutorial"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-card>
        <v-card-text class="pb-2">
          <v-text-field
              name="search"
              label="Search"
              append-icon="search"
              v-model="search"
              single-line
          ></v-text-field>
        </v-card-text>
        <v-card-title class="headline pb-2 pt-2">
          <span class="mr-3 contact-header">Contacts</span>
          <span v-if="selected.length > 0">
            <v-btn icon @click="emailGuests">
              <v-icon>email</v-icon>
            </v-btn>
            <v-btn icon @click="showMultipleDeleteDialog">
              <v-icon>delete</v-icon>
            </v-btn>
          </span>
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
                        v-if="(hover && $vuetify.breakpoint.smAndUp)  || props.selected"
                        v-model="props.selected"
                        primary
                        hide-details
                    ></v-checkbox>
                    <v-avatar v-else @click="() => props.selected = !props.selected" :color="props.item.colorClassName" size="40">
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
        <v-dialog v-model="deleteMultipleDialogIsShowing" max-width="360px">
          <v-card>
            <v-card-title primary-title class="title">
              Delete these contacts?
            </v-card-title>
            <v-card-text class="delete-contacts">
              <v-layout v-for="contact in selected" v-bind:key="contact.id">
                <span>{{ contact.fullname }}</span>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="hideMultipleDeleteDialog" flat>
                Cancel
              </v-btn>
              <v-btn @click="deleteGuests" flat color="red">
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
        deleteDialogIsShowing: false,
        deleteMultipleDialogIsShowing: false,
        prevRoute: null,
        introHighlightOnContactUs: false,
        intro: null
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.prevRoute = from.name
        vm.startTutorial()
      })
    },
    computed: {
      headers () {
        return [
          {text: 'Name', value: 'fullname', align: 'left', width: this.$vuetify.breakpoint.xsOnly ? '100%' : '15%'},
          {text: 'Email', value: 'email', width: '20%'},
          {text: 'Phone number', value: 'phoneNumber', width: '15%'},
          {text: 'Notes', value: 'notes', width: '40%'},
          {text: 'Date Added', value: 'createdAt', width: '10%'}
        ]
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
          if (!guest.avatarThumbnail && !guest.avatar) {
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
          name: 'content',
          params: {
            people: this.selected
          }
        })
      },
      async deleteGuests () {
        await this.$axios.$delete('/persons/', {
          data: {
            person_ids: this.selected.map(person => person.id)
          }
        })
        this.hideMultipleDeleteDialog()
        await this.getGuests()
      },
      showMultipleDeleteDialog () {
        this.deleteMultipleDialogIsShowing = true
      },
      hideMultipleDeleteDialog () {
        this.deleteMultipleDialogIsShowing = false
      },
      startTutorial () {
        if (this.$store.state.tutorial) {
          if (this.prevRoute === 'addGuest') {
            setTimeout(() => {
              this.intro = this.$intro()
              this.intro.setOptions({
                showStepNumbers: false,
                steps: [
                  {
                    intro: 'Congratulations you added your first contact!'
                  },
                  {
                    element: document.querySelector('.v-toolbar__side-icon'),
                    intro: 'You can find more features of MyTribe by clicking on the menu icon here.'
                  },
                  {
                    element: document.querySelector('.v-navigation-drawer'),
                    intro: `
                For instance, you can choose a pre-written email to send to your contacts by going to the "Share Content" page.<br><br>
                If you have a spreadsheet of your contacts, you can import them into MyTribe on the "Import Contacts" page.<br><br>
                And you can contact us on the "Contact Us" page.
                `
                  },
                  {
                    intro: 'That concludes the MyTribe tutorial.'
                  },
                  {
                    intro: 'Blessings to you and your family throughout your journey as Tribal Messiahs!'
                  }
                ]
              }).onchange((targetElement) => {
                this.updateIntroHighlightOnMenuItem(targetElement.className.includes('v-navigation-drawer'))
              }).onexit(this.endTutorial).oncomplete(this.endTutorial).start()
            }, 1000)
          } else {
            setTimeout(() => {
              this.intro = this.$intro()
              this.intro.setOptions({
                doneLabel: 'Skip',
                showStepNumbers: false,
                steps: [
                  {
                    intro: 'This "Contacts" page is where you can view all the contacts in your tribe.'
                  },
                  {
                    element: document.querySelector('.add-contact-btn'),
                    intro: 'Let\'s add a couple to your list of contacts. Click the round purple + button.'
                  }
                ]
              }).start()
            }, 1000)
          }
        }
      },
      exitTutorial () {
        if (this.$store.state.tutorial) this.intro.exit()
      },
      ...mapMutations([
        'endTutorial',
        'updateIntroHighlightOnMenuItem'
      ])
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
  .contact-header {
    height: 48px;
    display: flex;
    align-items: center;
  }
  .delete-contacts {
    font-size: 16px;
    padding-left: 32px;
  }
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
  @media screen and (max-width: 600px) {
    table.v-table thead th:nth-child(n+3) {
      display: none;
    }
  }
  .introjs-donebutton {
    color: black;
  }
</style>
