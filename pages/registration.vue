<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Registration</v-card-title>
        <v-card-text>
          <p>Fill in this form to register:</p>
          <v-form>
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
                      @input="$v.birthdate.$touch()"
                      @blur="$v.birthdate.$touch()"
                      :error-messages="birthdateErrors"
                      required
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
                    name="email"
                    label="Email"
                    id="email"
                    v-model="email"
                    @input="$v.email.$touch()"
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
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    @keyup.enter="submit"
                    :error-messages="passwordErrors"
                    id="password"
                    required
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
                    @input="$v.confirmPassword.$touch()"
                    @blur="$v.confirmPassword.$touch()"
                    @keyup.enter="submit"
                    :error-messages="confirmPasswordErrors"
                    id="confirmPassword"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
  import axios from '~/plugins/axios'

  export default {
    // Options / Data
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        birthdate: null,
        birthdateModal: false
      }
    },
    // props: [],
    // propsData: {},
    // computed: {},
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
      birthdate: { required }
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
        !this.$v.birthdate.required && errors.push('Birthdate is required')
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
