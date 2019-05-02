<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm6>
    <v-card>
      <v-card-title class="headline pb-0">Dashboard</v-card-title>
      <v-container
          fluid
          grid-list-lg
      >
        <v-layout row wrap>
          <v-flex>
            <v-card color="blue darken-2" class="white--text">
              <v-card-title primary-title>
                <v-icon dark>contacts</v-icon>
              </v-card-title>
              <v-card-text>
                <div class="display-2">{{contacts}}</div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3">
                <div class="subheading">Total Contacts</div>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex xs12>
            <v-card color="purple darken-1" class="white--text">
              <v-card-title primary-title>
                <v-icon dark>fa-wine-glass</v-icon>
              </v-card-title>
              <v-card-text>
                <div class="display-2">{{oneStepCouples}}</div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3">
                <div class="subheading">Couples given Holy Wine</div>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex xs12>
            <v-card color="red darken-1" class="white--text">
              <v-card-title primary-title>
                <v-icon dark>fa-magic</v-icon>
              </v-card-title>
              <v-card-text>
                <v-layout row align-center>
                  <v-flex xs2>
                    <span class="display-2">{{threeStepCouples}}</span>
                  </v-flex>
                  <v-flex xs10 v-if="threeStepCouplesProgress > 10">
                    <v-progress-circular
                        :width="20"
                        :size="40"
                        color="white"
                        :value="threeStepCouplesProgress">
                    </v-progress-circular>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="pa-3">
                <div class="subheading">Couples completed Chastening Ceremony</div>
              </v-card-actions>
            </v-card>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        threeStepCouples: 0,
        oneStepCouples: 0,
        contacts: 0
      }
    },
    async created () {
      const response = await this.$axios.get('/persons/dashboard')
      this.threeStepCouples = response.data.threeStepCouplesCount
      this.oneStepCouples = response.data.oneStepCouplesCount
      this.contacts = response.data.contactsCount
    },
    computed: {
      threeStepCouplesProgress () {
        return this.threeStepCouples / 430 * 100
      }
    }
  }
</script>

<style scoped>

</style>
