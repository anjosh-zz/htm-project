<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 sm8 md4>
      <v-card v-if="loginCheck" class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
                name="email"
                label="Email"
                id="email"
                v-model="email"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
                @focus="onInputClick"
                @keyup.enter="submit"
                :error-messages="emailErrors"
                prepend-icon="person"
            />
            <v-text-field
                name="password"
                label="Password"
                type="password"
                v-model="password"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                @focus="onInputClick"
                @keyup.enter="submit"
                :error-messages="passwordErrors"
                id="password"
                prepend-icon="lock"
            />
          </v-form>
          <p>Don't have an account?
            <router-link to="registration">Click here to register.</router-link>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import axios from '~/plugins/axios'
  export default {
    // Options / Data
    fetch () {
      return this.loadFB
    },
    created () {
      return axios.get('/auth/isLoggedIn')
        .then((response) => {
          if (response.data) {
            this.loggedIn()
          } else {
            this.loginCheck = true
          }
        })
    },
    data () {
      return {
        loginCheck: false,
        email: '',
        password: '',
        incorrect: false,
        incorrectemail: false,
        incorrectpassword: false,
        fbSignInParams: {
          scope: 'public_profile,email',
          return_scopes: true
        }
      }
    },
    // props: [],
    // propsData: {},
    // computed: {},
    methods: {
      onInputClick () {
        if (this.incorrect) {
          this.incorrect = false
          this.$v.$reset()
        }
      },
      loggedIn () {
        this.$store.commit('toggleLoggedIn')
        this.$router.push('/listguests')
      },
      onSignInSuccess (response) {
        console.log(response)
        axios.post('/auth/facebook/token', {
          access_token: response.authResponse.accessToken
        }).then((response) => {
          this.loggedIn()
        }).catch((error) => {
          console.log(error)
        })
      },
      onSignInError (error) {
        console.log('OH NOES', error)
      },
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          axios.post('/auth/local/', {
            email: this.email,
            password: this.password
          })
            .then((response) => {
              this.loggedIn()
            }).catch((error) => {
              if (error.response) {
                switch (error.response.status) {
                  case this.$g('HTTP_ERROR_CODES').UNAUTHORIZED:
                    console.log('UNAUTHORIZED')
                    this.incorrectemail = true
                    this.incorrectpassword = true
                    this.incorrect = true
                    break
                  default:
                    console.log(error)
                }
              }
              console.log(error)
            })
        }
      }
    },
    validations: {
      email: { required },
      password: { required }
    },
    computed: {
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push('Email is required')
        if (this.incorrectemail) {
          errors.push('Incorrect email/password')
          this.incorrectemail = false
        }
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Password is required')
        if (this.incorrectpassword) {
          errors.push('')
          this.incorrectpassword = false
        }
        return errors
      }
    },
    // watch: {},
    // Options / DOM
    // el () {},
    // template: '',
    // render () {},
    // Options / Lifecycle Hooks
    // beforeCreate () {},
    // created () {},
    // beforeMount () {},
    // mounted () {},
    // beforeUpdate () {},
    // updated () {},
    // activated () {},
    // deactivated () {},
    // beforeDestroy () {},
    // destroyed () {},
    // Options / Assets
    // directives: {},
    // filters: {},
    // components: {},
    // Options / Misc
    // parent: null,
    mixins: [ validationMixin ]
    // name: '',
    // extends: {},
    // delimiters: [ '{{', '}}' ],
    // functional: false
  }
</script>
