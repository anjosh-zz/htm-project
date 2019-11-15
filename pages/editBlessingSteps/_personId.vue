<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title class="headline">Blessing Steps Completed for {{person.fullname}}</v-card-title>
        <v-card-text v-if="loadingSteps" style="text-align: center;">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card-text>
        <v-card-text v-else>
          <v-form>
            <v-container fluid class="pt-0">
              <v-layout row wrap mb-3>
                <v-flex xs8>
                  <h4>Blessing Steps</h4>
                </v-flex>
                <v-flex xs4 v-if="blessingSteps.some(step => step.selected)">
                  <h4>Date</h4>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap v-for="step in blessingSteps" :key="step.name">
                <v-flex xs8>
                  <v-checkbox v-model="step.selected"
                              :label="step.name"
                              hide-details
                              @change="checkBlessingStep(step)">
                  </v-checkbox>
                </v-flex>
                <v-flex xs4>
                  <v-text-field class="pt-2"
                      v-if="step.selected"
                      mask="date"
                      v-model="step.date"
                      return-masked-value
                      hide-details
                      @change="changeStepDate(step)"
                      @input="() => saved = false"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="!loadingSteps">
          <v-btn 
            v-if="previousSaves.length" 
            color="secondary" 
            @click="undoPreviousSave">
            Undo
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="saved" flat :disabled="true">
            Saved
          </v-btn>
          <v-btn 
            color="primary" 
            @click="updateBlessingSteps">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment'
  import BlessingSteps from '~/components/blessingSteps'

  export default {
    components: {BlessingSteps},
    async created () {
      const blessingSteps = await this.$axios.$get('/actionTypes')
      const existingSteps = {}
      if (this.$route.params.personId) {
        this.person = await this.$axios.$get('/persons/' + this.$route.params.personId)
        this.person.Object.forEach((action) => {
          action.date = moment(action.timestamp).format(this.dateFormat)
          action.selected = true
          action.name = action.ActionType.name
          action.ActionId = action.ActionObject.ActionId
          action.id = action.ActionType.id
          existingSteps[action.id] = action
        })
        this.person.Subject.forEach((action) => {
          action.date = moment(action.timestamp).format(this.dateFormat)
          action.selected = true
          action.name = action.ActionType.name
          action.ActionId = action.ActionSubject.ActionId
          action.id = action.ActionType.id
          existingSteps[action.id] = action
        })
      }
      if (this.person.RelationshipObject || this.person.RelationshipSubject) {
        const relationships = this.person.RelationshipObject.concat(this.person.RelationshipSubject)
        const spouseRelationship = relationships.find(r => r && r.RelationshipTypeId === 1)
        if (spouseRelationship) {
          let spouse
          if (spouseRelationship.Object) {
            spouse = spouseRelationship.Object
          } else if (spouseRelationship.Subject) {
            spouse = spouseRelationship.Subject
          }
          if (spouse && spouse.fullname) {
            this.person.spouse = spouse
          }
        }
      }
      this.blessingSteps = blessingSteps.map((step, idx) => {
        if (existingSteps[step.id]) {
          step = existingSteps[step.id]
        } else {
          step = {
            ...step,
            selected: false,
            date: moment().format(this.dateFormat)
          }
        }
        this.previousDates[idx] = step.date
        return step
      })
      this.loadingSteps = false
    },
    data () {
      return {
        blessingSteps: [],
        dateFormat: 'MM/DD/YYYY',
        person: {},
        previousSaves: [],
        loadingSteps: true,
        previousDates: {},
        saved: false
      }
    },
    methods: {
      updateBlessingSteps () {
        this.$router.push('/listguests')
      },
      async checkBlessingStep (step) {
        this.saved = false
        if (step.selected) {
          const personIds = [this.person.id]
          if (this.person.spouse) personIds.push(this.person.spouse.id)
          const { data: action } = await this.$axios.post('/actions', {
            date: moment(step.date),
            actionTypeId: step.id,
            personIds
          })
          action.date = moment(action.timestamp).format(this.dateFormat)
          action.selected = true
          action.name = step.name
          action.ActionId = action.id
          action.id = action.ActionTypeId
          this.blessingSteps[step.id - 1] = action
        } else {
          await this.$axios.delete('/actions/' + step.ActionId)
          step.selected = false
        }
        const previousStep = Object.assign({}, step)
        previousStep.selected = !step.selected
        this.previousSaves.push(previousStep)
        this.saved = true
      },
      async changeStepDate (step) {
        this.saved = false
        const { data: action } = await this.$axios.post('/actions/' + step.ActionId, {
          date: moment(step.date)
        })
        step.date = moment(action.timestamp).format(this.dateFormat)
        if (step.date !== this.previousDates[step.id - 1]) {
          const previousStep = Object.assign({}, step)
          previousStep.date = this.previousDates[step.id - 1]
          this.previousSaves.push(previousStep)
          this.previousDates[step.id - 1] = step.date
        }
        this.saved = true
      },
      async undoPreviousSave () {
        this.saved = false
        const step = this.previousSaves.pop()
        if (step.selected && !this.blessingSteps[step.id - 1].selected) {
          const personIds = [this.person.id]
          if (this.person.spouse) personIds.push(this.person.spouse.id)
          const { data: action } = await this.$axios.post('/actions', {
            date: moment(step.date),
            actionTypeId: step.id,
            personIds
          })
          action.date = moment(action.timestamp).format(this.dateFormat)
          action.selected = true
          action.name = step.name
          action.ActionId = action.id
          action.id = action.ActionTypeId
          this.$set(this.blessingSteps, step.id - 1, action)
        } else if (!step.selected && this.blessingSteps[step.id - 1].selected) {
          await this.$axios.delete('/actions/' + this.blessingSteps[step.id - 1].ActionId)
          this.blessingSteps[step.id - 1].selected = false
          this.$set(this.blessingSteps, step.id - 1, this.blessingSteps[step.id - 1])
        } else {
          const { data: action } = await this.$axios.post('/actions/' + step.ActionId, {
            date: moment(step.date)
          })
          this.previousDates[step.id - 1] = step.date
          this.blessingSteps[step.id - 1].date = moment(action.timestamp).format(this.dateFormat)
          this.$set(this.blessingSteps, step.id - 1, this.blessingSteps[step.id - 1])
        }
        this.saved = true
      }
    }
  }
</script>