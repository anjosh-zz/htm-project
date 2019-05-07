<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="headline">{{editing ? 'Edit Guest': 'Add Guest'}}</v-card-title>
        <v-card-text>
          <v-form>
            <v-container fluid class="pt-0">
              <v-layout row>
                <v-flex xs12>
                  <v-avatar
                    class="grey"
                  >
                    <img :src="avatarSrc" alt="avatar" v-if="avatarSrc">
                  </v-avatar>
                  <Snapshot
                      :avatarSrc="avatarSrc"
                      v-on:addImage="addImage"
                  >
                  </Snapshot>
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
              <v-layout>
                <v-flex xs12>
                  <v-radio-group class="mt-0" v-model="gender" row hide-details>
                    <v-radio
                        label="Male"
                        value="true"
                    >
                    </v-radio>
                    <v-radio
                        label="Female"
                        value="false"
                    >
                    </v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="email"
                    label="Email"
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
                    mask="phone"
                    id="phoneNumber"
                    prepend-icon="phone"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <p>Preferred method of contact:</p>
                  <v-btn-toggle class="full-width" mandatory v-model="preferredContactMethod">
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
                    @blur="$v.birthdate.$touch()"
                    :error-messages="birthdateErrors"
                    :return-masked-value="true"
                    prepend-icon="cake"
                  ></v-text-field>
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
          <v-btn v-if="!editing && step === 1" color="secondary" @click="addAnotherPerson">
            Add Spouse
          </v-btn>
          <v-btn color="primary" @click="submit">
            {{editing ? 'Save': 'Add'}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  import moment from 'moment'
  import googlePhoneNumberLib from 'google-libphonenumber'

  import Snapshot from '~/components/snapshot.vue'

  const phoneUtil = googlePhoneNumberLib.PhoneNumberUtil.getInstance()

  export default {
    props: ['editing', 'step'],
    components: {Snapshot},
    mixin: [validationMixin],
    async created () {
      if (this.$route.params.personId) {
        const response = await this.$axios.$get('/persons/' + this.$route.params.personId)
        if (response) {
          let person = response
          person.birthdate = moment(person.birthdate).format(this.birthdateFormat)
          if (person.phoneNumber) {
            const number = phoneUtil.parseAndKeepRawInput(person.phoneNumber, 'US')
            person.phoneNumber = number.getNationalNumber()
          }
          if (person.gender != null) {
            person.gender = person.gender.toString()
          }
          Object.assign(this, person)
          this.avatarSrc = person.avatar || person.avatarURL
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
        firstMeetingLocation: '',
        avatarSrc: '',
        gender: ''
      }
    },
    methods: {
      addImage (avatarSrc) {
        this.avatarSrc = avatarSrc
      },
      submit (event, addAnother) {
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
            gender: this.gender
          }
          if (this.avatarURL && this.avatarURL === person.avatar) {
            delete person.avatar
          }
          this.$emit('submit', person, addAnother)
        }
      },
      addAnotherPerson (event) {
        this.submit(event, true)
      }
    },
    validations: {
      fullname: { required },
      email: { email },
      notes: { maxLength: maxLength(1000) },
      birthdate: {
        isDate: function (date) {
          return date ? moment(date, this.birthdateFormat, true).isValid() : true
        }
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

<style>
 .full-width {
    width: 100%
 }
</style>
