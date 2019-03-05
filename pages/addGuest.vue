<template>
  <v-window v-model="step">
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
        <v-flex xs12 sm5>
          <v-card>
            <v-card-title class="headline">Blessing Steps Completed</v-card-title>
            <v-card-text>
              <v-form>
                <v-container fluid class="pt-0">
                  <BlessingSteps
                      :editing="false"
                      :blessingSteps=blessingSteps
                      :actions=[]
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
  import ChangePerson from '~/components/changePerson.vue'
  import BlessingSteps from '~/components/blessingSteps'

  export default {
    components: {BlessingSteps, ChangePerson},
    data () {
      return {
        step: 1,
        subjectId: null,
        objectId: null,
        coupleName: '',
        blessingSteps: []
      }
    },
    methods: {
      async submit (person, addAnother) {
        const HUSBAND_WIFE_RELATIONSHIP_TYPE_ID = 1
        const { id, fullname } = await this.$axios.$post('/persons/create', person)
        if (this.step === 1) {
          this.subjectId = id
        } else if (this.step === 2) {
          this.objectId = id
          await this.$axios.$post('relationships', {
            subjectId: this.subjectId,
            objectId: this.objectId,
            relationshipTypeId: HUSBAND_WIFE_RELATIONSHIP_TYPE_ID
          })
        }

        if (addAnother) {
          this.coupleName = `${fullname.split(' ')[0]} & `
          this.step = 2
        } else {
          this.coupleName += fullname.split(' ')[0]
          this.step = 3
        }
      },
      async addBlessingSteps () {
        await this.blessingSteps.filter(step => step.selected)
          .forEach(async (step) => {
            await this.$axios.$post('actions', {
              personIds: [this.objectId, this.subjectId],
              actionTypeId: step.id
            })
          })

        this.$router.push('/listguests')
      }
    }
  }
</script>
