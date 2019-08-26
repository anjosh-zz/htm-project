<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card v-show="purpose !== 'app'">
        <v-card-title class="headline">Contact Us</v-card-title>
        <v-card-text class="subheading">
          What would you like to contact us about?
        </v-card-text>
        <v-card-actions>
          <v-btn round block large color="info" href="https://tribenet.co/contact/" target="_blank">Tribal Messiahship in general</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn round block large color="primary" class="mb-3" @click="() => (this.purpose = 'app')">MyTribe App</v-btn>
        </v-card-actions>
      </v-card>
      <iframe v-show="purpose === 'app'" class="airtable-embed" src="https://airtable.com/embed/shrxjRDDqR972o93q?backgroundColor=yellow"
              frameborder="0" onmousewheel="" width="100%" height="650px"
              style="background: transparent; border: 1px solid #ccc;"></iframe>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    auth: false,
    data () {
      return {
        purpose: null
      }
    }
  }
</script>

<style>
  .v-card__actions .v-btn {
    text-transform: none;
    height: 60px;
    font-size: large;
  }
</style>
