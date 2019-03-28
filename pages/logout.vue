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
  export default {
    methods: {
      async submit () {
        try {
          const encodeQuery = queryObject => {
            return Object.keys(queryObject)
              .map(
                key =>
                  encodeURIComponent(key) + '=' + encodeURIComponent(queryObject[key])
              )
              .join('&')
          }

          const {domain, client_id: clientId} = this.$auth.strategies.auth0.options
          const opts = {
            client_id: clientId,
            returnTo: window.location.origin + this.$auth.options.redirect.logout
          }
          window.location = `https://${domain}/v2/logout` + '?' + encodeQuery(opts)
          await this.$auth.logout()
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
