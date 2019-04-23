<template>
  <v-window v-model="step" touchless>
    <v-window-item :value="1">
      <ChangePerson
          :editing="false"
          :step="step"
          v-on:submit="submit"
      >
      </ChangePerson>
    </v-window-item>
    <v-window-item :value="2">
      <ChangePerson
          :editing="false"
          :step="step"
          v-on:submit="submit"
      >
      </ChangePerson>
    </v-window-item>
    <v-window-item :value="3">
      <v-layout row align-center justify-center>
        <v-flex xs12 sm6>
          <v-card>
            <v-card-title class="headline">Blessing Steps Completed</v-card-title>
            <v-card-text>
              <v-form>
                <v-container fluid class="pt-0">
                  <BlessingSteps
                      :editing="false"
                      :blessingSteps=blessingSteps
                  >
                  </BlessingSteps>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addBlessingSteps">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-window-item>
  </v-window>
</template>

<script>
  import moment from 'moment'

  import ChangePerson from '~/components/changePerson.vue'
  import BlessingSteps from '~/components/blessingSteps'

  export default {
    components: {BlessingSteps, ChangePerson},
    async created () {
      const blessingSteps = await this.$axios.$get('/actionTypes')
      this.blessingSteps = blessingSteps.map(step => ({
        ...step,
        selected: false,
        date: moment().format(this.dateFormat)
      }))
    },
    data () {
      return {
        step: 1,
        subjectId: null,
        objectId: null,
        blessingSteps: [],
        dateFormat: 'MM/DD/YYYY'
      }
    },
    methods: {
      async submit (person, addAnother) {
        const HUSBAND_WIFE_RELATIONSHIP_TYPE_ID = 1
        const { id } = await this.$axios.$post('/persons/create', person)
        window.scrollTo(0, 0)
        if (this.step === 1) {
          this.subjectId = id
        } else if (this.step === 2) {
          this.objectId = id
          await this.$axios.$post('relationships', {
            SubjectId: this.subjectId,
            ObjectId: this.objectId,
            RelationshipTypeId: HUSBAND_WIFE_RELATIONSHIP_TYPE_ID
          })
        }

        if (addAnother) {
          this.step = 2
        } else {
          this.step = 3
        }
      },
      async addBlessingSteps () {
        for (const step of this.blessingSteps.filter(step => step.selected)) {
          await this.$axios.$post('actions', {
            personIds: [this.objectId, this.subjectId],
            actionTypeId: step.id,
            date: step.date
          })
        }

        this.$router.push('/listguests')
      }
    }
  }
</script>
