<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-checkbox v-for="step in this.blessingSteps" :key="step.name"
          v-model="step.selected"
          :label="step.name"
          hide-details>
      </v-checkbox>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['actions', 'blessingSteps'],
    async created () {
      const blessingSteps = await this.$axios.$get('/actionTypes')
      blessingSteps.map(step => ({...step, selected: false}))
        .forEach(step => {
          if (this.actions.some(action => step.id === action.ActionTypeId)) {
            step.selected = true
          }
          this.blessingSteps.push(step)
        })
    }
  }
</script>
