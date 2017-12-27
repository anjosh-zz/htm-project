<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 md6>
      <v-card>
        <v-card-title class="headline">Logout</v-card-title>
        <v-card-text>
          <p>Are you sure that you would like to log out?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">Log out</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    middleware: 'auth',
    methods: {
      submit () {
        this.$store.commit('toggleLoggedIn')
        this.$router.push('/')
      }
    }
  }
</script>
