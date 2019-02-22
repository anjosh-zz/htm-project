<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Registration</v-card-title>
        <v-card-text>
          <p>Fill in this form to register:</p>
          <v-form :lazy-validation="true">
            <v-container fluid class="pa-0">
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
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    v-model="email"
                    @blur="$v.email.$touch()"
                    @keyup.enter="submit"
                    :error-messages="emailErrors"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    @blur="$v.password.$touch()"
                    @keyup.enter="submit"
                    :error-messages="passwordErrors"
                    id="password"
                    required
                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    v-model="confirmPassword"
                    @blur="$v.confirmPassword.$touch()"
                    @keyup.enter="submit"
                    :error-messages="confirmPasswordErrors"
                    id="confirmPassword"
                    required
                    :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {email, minLength, required, sameAs} from 'vuelidate/lib/validators'
  import axios from '~/plugins/axios'
  import moment from 'moment'

  export default {
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        fullname: '',
        birthdate: this.birthdateFormat,
        birthdateFormat: 'MM/DD/YYYY'
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          axios.post('/users/', {
            email: this.email,
            password: this.password,
            birthdate: this.birthdate,
            fullname: this.fullname
          }).then((response) => {
            this.$store.commit('toggleLoggedIn')
            this.$router.push('/listguests')
          }).catch((error) => {
            console.log(error)
          })
        }
      }
    },
    validations: {
      fullname: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      confirmPassword: { sameAsPassword: sameAs('password'), required },
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
        !this.$v.email.required && errors.push('Email is required')
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Password must be at least 6 characters')
        !this.$v.password.required && errors.push('Password is required')
        return errors
      },
      confirmPasswordErrors () {
        const errors = []
        if (!this.$v.confirmPassword.$dirty) return errors
        !this.$v.confirmPassword.sameAsPassword && errors.push('Must match password')
        !this.$v.confirmPassword.required && errors.push('Confirm password is required')
        return errors
      },
      birthdateErrors () {
        const errors = []
        if (!this.$v.birthdate.$dirty) return errors
        !this.$v.birthdate.isDate && errors.push('Enter a valid birthday')
        return errors
      }
    },
    mixins: [ validationMixin ]
  }
</script>
