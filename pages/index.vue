<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mt-3">
        <div class="text-xs-center pt-3">
          <img src="/logo1.png" alt="Vuetify.js" class="mb-1" width="20%"/>
        </div>
        <v-card-title class="headline">Welcome to MyTribe</v-card-title>
        <v-card-text>
          <p>Making it easier to stay in touch with the people that matter most.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat nuxt to="/login" v-if="!this.$store.state.loggedIn">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
