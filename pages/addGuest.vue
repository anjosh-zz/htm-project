<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="headline">Add Guest</v-card-title>
        <v-card-text>
          <p>Please fill out all the required fields (*):</p>
          <v-form>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12 sm10>
                  <v-text-field
                    label="Full Name"
                    v-model="fullName"
                    @input="$v.fullName.$touch()"
                    @blur="$v.fullName.$touch()"
                    id="fullName"
                    :error-messages="fullnameErrors"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
                  <v-text-field
                    v-model="alias"
                    label="Is there a name that you would like to call them by?"
                    id="alias"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
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
                <v-flex xs12 sm10>
                  <v-text-field
                    v-model="phoneNumber"
                    label="Phone Number"
                    id="phoneNumber"
                    prepend-icon="phone"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
                  <v-btn-toggle mandatory v-model="preferredContactMethod">
                    <v-btn flat>
                      <v-icon>email</v-icon>
                      <span class="px-1">Email</span>
                    </v-btn>
                    <v-btn flat>
                      <v-icon>phone</v-icon>
                      <span class="px-1">Phone</span>
                    </v-btn>
                    <v-btn flat>
                      <v-icon>textsms</v-icon>
                      <span class="px-1">Text</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10 mt-2>
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
                    <v-date-picker v-model="birthdate" scrollable autosave>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
                  <v-text-field
                    label="Place where you met"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
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
                    <v-date-picker v-model="meetingDate" scrollable autosave>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm10>
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
          <v-btn color="primary" flat large @click="submit">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  export default {
    mixin: [validationMixin],
    data: () => {
      return {
        fullName: '',
        alias: '',
        email: '',
        phoneNumber: '',
        notes: '',
        birthdate: null,
        birthdateModal: false,
        meetingDate: null,
        meetingDateModal: false,
        preferredContactMethod: 0
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
      }
    },
    validations: {
      fullName: { required },
      email: { required, email },
      notes: { maxLength: maxLength(1000) }
    },
    computed: {
      fullnameErrors () {
        const errors = []
        if (!this.$v.fullName.$dirty) return errors
        !this.$v.fullName.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
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
