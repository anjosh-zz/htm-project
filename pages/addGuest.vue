<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="headline">Add Guest</v-card-title>
        <v-card-text>
          <p>Please fill out all the required fields (*):</p>
          <v-form>
            <v-container fluid class="pt-0">
              <v-layout row>
                <v-flex xs12>
                  <v-avatar
                    class="grey"
                  >
                    <img :src="avatarSrc" alt="avatar" v-if="avatarSrc">
                  </v-avatar>
                  <v-btn color="secondary" @click="showSnapshot">{{avatarSrc ? 'Change picture' : 'Add picture'}}</v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Full Name"
                    v-model="fullname"
                    @input="$v.fullname.$touch()"
                    @blur="$v.fullname.$touch()"
                    id="fullname"
                    :error-messages="fullnameErrors"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="alias"
                    label="What name do they go by?"
                    id="alias"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-divider></v-divider>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    :error-messages="emailErrors"
                    id="email"
                    required
                    prepend-icon="email"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="phoneNumber"
                    label="Phone Number"
                    id="phoneNumber"
                    prepend-icon="phone"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <p>Preferred method of contact</p>
                  <v-btn-toggle mandatory v-model="preferredContactMethod">
                    <v-btn flat value="email">
                      <v-icon>email</v-icon>
                      <span class="px-1">Email</span>
                    </v-btn>
                    <v-btn flat value="phone">
                      <v-icon>phone</v-icon>
                      <span class="px-1">Phone</span>
                    </v-btn>
                    <v-btn flat value="text">
                      <v-icon>textsms</v-icon>
                      <span class="px-1">Text</span>
                    </v-btn>
                  </v-btn-toggle>
                  <v-divider class="mt-2"></v-divider>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 mt-2>
                  <v-dialog
                    v-model="birthdateModal"
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="Birthday"
                      name="birthdate"
                      id="birthdate"
                      v-model="birthdate"
                      prepend-icon="cake"
                    ></v-text-field>
                    <v-date-picker
                      v-model="birthdate"
                      scrollable
                      autosave>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Place where you met"
                    v-model="firstMeetingLocation"
                    prepend-icon="place"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-dialog
                    v-model="meetingDateModal"
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="Date when you met"
                      name="meetingDate"
                      id="meetingDate"
                      v-model="meetingDate"
                      prepend-icon="event"
                    ></v-text-field>
                    <v-date-picker
                      v-model="meetingDate"
                      scrollable
                      autosave
                      color="green">
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Notes"
                    v-model="notes"
                    @input="$v.notes.$touch()"
                    @blur="$v.notes.$touch()"
                    :error-messages="notesErrors"
                    multi-line
                    :counter="1000"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Add</v-btn>
        </v-card-actions>
        <Snapshot
          :showSnapshot="snapshotIsShowing"
          v-on:close="hideSnapshot"
          v-on:addImage="addImage"
        >
        </Snapshot>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import axios from '~/plugins/axios'

  import Snapshot from '~/components/snapshot.vue'

  export default {
    middleware: 'auth',
    components: {Snapshot},
    mixin: [validationMixin],
    data: () => {
      return {
        fullname: '',
        alias: '',
        email: '',
        phoneNumber: '',
        notes: '',
        birthdate: null,
        birthdateModal: false,
        meetingDate: null,
        meetingDateModal: false,
        preferredContactMethod: 'email',
        snapshotIsShowing: false,
        firstMeetingLocation: '',
        avatarSrc: ''
      }
    },
    methods: {
      addImage (avatarSrc) {
        this.avatarSrc = avatarSrc
      },
      showSnapshot () {
        this.snapshotIsShowing = true
      },
      hideSnapshot () {
        this.snapshotIsShowing = false
      },
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          axios.post('/persons/create', {
            avatar: this.avatarSrc,
            fullname: this.fullname,
            alias: this.alias,
            email: this.email,
            phoneNumber: this.phoneNumber,
            preferredContactMethod: this.preferredContactMethod,
            birthdate: this.birthdate,
            timeMet: this.meetingDate,
            firstMeetingLocation: this.firstMeetingLocation
          }).then((response) => {
            console.log(response)
            this.$router.push('/listguests')
          })
        }
      }
    },
    validations: {
      fullname: { required },
      email: { required, email },
      notes: { maxLength: maxLength(1000) }
    },
    computed: {
      fullnameErrors () {
        const errors = []
        if (!this.$v.fullname.$dirty) return errors
        !this.$v.fullname.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid email')
        !this.$v.email.required && errors.push('Email is required')
        return errors
      },
      notesErrors () {
        const errors = []
        if (!this.$v.notes.$dirty) return errors
        !this.$v.notes.maxLength && errors.push('Notes must be at most 1000 characters long')
        return errors
      }
    }
  }
</script>
