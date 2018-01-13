<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md6>
      <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <p>Login to view and manage your guests.</p>
          <v-form>
            <v-container fluid class="pa-0">
              <v-layout row>
                <v-flex xs12 sm8>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    v-model="email"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    @keyup.enter="submit"
                    :error-messages="emailErrors"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm8>
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
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  export default {
    // Options / Data
    data () {
      return {
        email: '',
        password: ''
      }
    },
    // props: [],
    // propsData: {},
    // computed: {},
    methods: {
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.$store.commit('toggleLoggedIn')
          this.$router.push('/listguests')
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
        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Password is required')
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
