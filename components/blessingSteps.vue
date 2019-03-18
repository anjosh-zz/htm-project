<template>
  <v-container>
    <v-layout row wrap mb-3>
      <v-flex xs8>
        <h4>Select Step Completed</h4>
      </v-flex>
      <v-flex xs4 v-if="blessingSteps.some(step => step.selected)">
        <h4>Set Date Occurred</h4>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap v-for="step in blessingSteps" :key="step.name">
      <v-flex xs8>
        <v-checkbox v-model="step.selected"
                    :label="step.name"
                    hide-details>
        </v-checkbox>
      </v-flex>
      <v-flex xs4>
        <v-text-field class="pt-2"
            v-if="step.selected"
            mask="date"
            v-model="step.date"
            return-masked-value
            hide-details
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['blessingSteps']
  }
</script>
