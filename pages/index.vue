<template>
  <v-layout column justify-center align-center class="pt-3 mt-3">
    <v-flex xs12 sm4>
      <v-card>
        <div class="text-xs-center pt-3">
          <img src="/logo1.png" class="mb-1" width="20%"/>
        </div>
        <v-card-title class="headline">Welcome to MyTribe</v-card-title>
        <v-card-text>
          <p>Making it easier to stay in touch with the people that matter most.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" nuxt to="/login" v-if="!this.$auth.loggedIn">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    auth: false
  }
</script>
