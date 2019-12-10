<template>
  <ChangePerson
    :editing="true"
    v-on:submit="submit"
  >
  </ChangePerson>
</template>

<script>
  import ChangePerson from '~/components/changePerson.vue'

  export default {
    components: {ChangePerson},
    methods: {
      submit (person) {
        let personId = this.$route.params.personId
        this.$axios.$post(`/persons/${personId}`, person)
          .then(() => {
            this.$router.push('/listguests')
          })
      }
    }
  }
</script>
