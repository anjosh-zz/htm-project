<template></template>

<script>
  import jwt from 'jsonwebtoken'

  export default {
    auth: false,
    async created () {
      if (this.$route.query.token) {
        const {
          domain,
          client_secret: secret,
          client_id: audience,
          issuer
        } = this.$auth.strategies.auth0.options

        const decoded = jwt.verify(
          this.$route.query.token,
          secret,
          {
            audience: audience,
            issuer: issuer
          }
        )

        const person = await this.$axios.$post('/users/', {
          email: decoded.email
        })

        const encodeQuery = queryObject => {
          return Object.keys(queryObject)
            .map(
              key =>
                encodeURIComponent(key) + '=' + encodeURIComponent(queryObject[key])
            )
            .join('&')
        }

        const opts = {
          state: this.$route.query.state,
          person_id: person.id
        }

        window.location = `https://${domain}/continue?${encodeQuery(opts)}`
      }
    },
    data () {
      return {
        email: ''
      }
    },
    methods: {
      async submit () {
      }
    }
  }
</script>
