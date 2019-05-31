<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="mb-3 headline">Edit Blessing Step</v-card-title>
        <v-layout
            align-center
            justify-space-around
            wrap
        >
          <v-avatar color="secondary" :size="60">
            <v-icon dark>{{action.icon}}</v-icon>
          </v-avatar>

        </v-layout>

        <v-card-title class="justify-center title">
          {{action.name}}
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
                prepend-icon="calendar_today"
                class="mb-3"
                mask="date"
                return-masked-value
                hide-details
                v-model="action.date"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'actionDetails',
    async created () {
      this.action = await this.$axios.$get('/actions/' + this.$route.params.actionId)
      this.action.date = moment(this.action.timestamp).format('MM/DD/YYYY')
      this.action.icon = this.blessingStepsIconMap[this.action.ActionTypeId]
      this.action.name = this.action.ActionType.name
    },
    data () {
      return {
        action: {},
        blessingStepsIconMap: {
          1: 'fa-wine-glass',
          2: 'fa-praying-hands',
          3: 'fa-magic',
          4: 'fa-book',
          5: 'fa-hand-holding-usd',
          6: 'far fa-heart',
          7: 'fas fa-heart'
        }
      }
    },
    methods: {
      submit () {
        let actionId = this.$route.params.actionId
        this.action.date = moment(this.action.date)
        this.$axios.$post(`/actions/${actionId}`, this.action)
          .then(() => {
            this.$router.push('/listguests')
          })
      }
    }
  }
</script>
