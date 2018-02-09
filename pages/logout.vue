<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Logout</v-card-title>
        <v-card-text>
          <p>Are you sure that you would like to log out?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">Log out</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
  import axios from '~/plugins/axios'

  export default {
    middleware: 'auth',
    methods: {
      submit () {
        axios.post('/auth/logout')
          .then(() => {
            this.$store.commit('toggleLoggedIn')
            this.$router.push('/')
          }).catch((error) => {
            console.log(error)
          })
      }
    }
  }
</script>
