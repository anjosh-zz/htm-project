<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Progress</v-card-title>
        <v-card-text>
          <v-progress-linear
              :height="30"
              :value="progress"
              color="primary"
              class="title"
          >
          </v-progress-linear>
        </v-card-text>
        <v-card-text class="subheading">
          <div class="mb-3">
            You have supported {{ threeStepCouples }} couples complete the first three steps of the Blessing.
            <span v-if="progress > 0">Thank you!</span>
          </div>
          <div v-if="progress < 100">
            To become a Heavenly Tribal Messiah Accomplisher you must support
            430 couples complete the first three steps.
            <span v-if="progress >= 10"> You are {{Math.round(progress)}}% there.</span>
          </div>
          <div v-else>
            You have supported {{ threeStepCouples }} couples complete the three first steps of the Blessing.
            Thank you! Congratulations you are qualified to be a Heavenly Tribal Messiah Accomplisher!
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        threeStepCouples: 0
      }
    },
    async created () {
      const response = await this.$axios.get('/persons/progress')
      this.threeStepCouples = response.data
    },
    computed: {
      progress () {
        return this.threeStepCouples / 430 * 100
      }
    }
  }
</script>

<style scoped>

</style>
