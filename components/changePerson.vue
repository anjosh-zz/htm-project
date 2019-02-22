<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="headline">{{editing ? 'Edit Guest': 'Add Guest'}}</v-card-title>
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
                  <v-btn-toggle style="width: 100%" mandatory v-model="preferredContactMethod">
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
                  <v-text-field
                    label="Birthday"
                    name="birthdate"
                    id="birthdate"
                    mask="date"
                    :placeholder="birthdateFormat"
                    v-model="birthdate"
                    @input="$v.birthdate.$touch()"
                    @blur="$v.birthdate.$touch()"
                    :error-messages="birthdateErrors"
                    :return-masked-value="true"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap >
                <p>Blessing Steps Completed{{editing ? " (These cannot be updated yet.)" : ''}}</p>
                <v-flex xs12 v-for="step in blessingSteps" :key="step.name">
                  <v-checkbox
                      class="mt-0"
                      :disabled="editing"
                      v-model="step.selected"
                      :label="step.name"
                      hide-details>
                  </v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-textarea
                    label="Notes"
                    v-model="notes"
                    @input="$v.notes.$touch()"
                    @blur="$v.notes.$touch()"
                    :error-messages="notesErrors"
                    multi-line
                    :counter="1000"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">
            {{editing ? 'Save': 'Add'}}
          </v-btn>
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
  import moment from 'moment'

  import Snapshot from '~/components/snapshot.vue'

  export default {
    props: ['editing'],
    middleware: 'auth',
    components: {Snapshot},
    mixin: [validationMixin],
    async created () {
      const blessingSteps = await axios.get('/actionTypes')
      this.blessingSteps = blessingSteps.data.map(step => ({...step, selected: false}))
      if (this.$route.params.personId) {
        const response = await axios.get('/persons/' + this.$route.params.personId)
        if (response.data) {
          let person = response.data
          person.birthdate = moment(person.birthdate).format(this.birthdateFormat)
          Object.assign(this, person)
          this.avatarSrc = person.avatar || person.avatarURL

          const actions = person.Subject.concat(person.Object)
          this.blessingSteps.forEach(step => {
            if (actions.some(action => step.id === action.ActionTypeId)) {
              step.selected = true
            }
          })
        }
      }
    },
    data () {
      return {
        fullname: '',
        alias: '',
        email: '',
        phoneNumber: '',
        notes: '',
        birthdate: this.birthdateFormat,
        birthdateFormat: 'MM/DD/YYYY',
        timeMet: null,
        preferredContactMethod: 'email',
        snapshotIsShowing: false,
        firstMeetingLocation: '',
        avatarSrc: '',
        blessingSteps: [],
        Actions: []
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
          let person = {
            avatar: this.avatarSrc,
            fullname: this.fullname,
            alias: this.alias,
            email: this.email,
            phoneNumber: this.phoneNumber,
            preferredContactMethod: this.preferredContactMethod,
            birthdate: this.birthdate,
            timeMet: this.timeMet,
            firstMeetingLocation: this.firstMeetingLocation,
            notes: this.notes,
            blessingSteps: this.blessingSteps,
            Actions: this.Actions
          }
          if (this.avatarURL && this.avatarURL === person.avatar) {
            delete person.avatar
          }
          this.$emit('submit', person)
        }
      }
    },
    validations: {
      fullname: { required },
      email: { email },
      notes: { maxLength: maxLength(1000) },
      birthdate: {
        isDate: (date) => moment(date, this.birthdateFormat, true).isValid()
      }
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
        return errors
      },
      notesErrors () {
        const errors = []
        if (!this.$v.notes.$dirty) return errors
        !this.$v.notes.maxLength && errors.push('Notes must be at most 1000 characters long')
        return errors
      },
      birthdateErrors () {
        const errors = []
        if (!this.$v.birthdate.$dirty) return errors
        !this.$v.birthdate.isDate && errors.push('Enter a valid birthday')
        return errors
      }
    }
  }
</script>
