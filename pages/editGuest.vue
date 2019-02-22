<template>
  <ChangePerson
    :editing="true"
    v-on:submit="submit"
  >
  </ChangePerson>
</template>

<script>
  import ChangePerson from '~/components/changePerson.vue'
  import axios from '~/plugins/axios'

  export default {
    middleware: 'auth',
    components: {ChangePerson},
    methods: {
      submit (person) {
        let personId = this.$route.params.personId
        axios.post(`/persons/${personId}`, person)
          .then((response) => {
            this.$router.push('/listguests')
          })
      }
    }
  }
</script>
