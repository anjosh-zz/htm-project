<template>
  <v-window v-model="step" touchless>
    <v-window-item :value="1">
      <ChangePerson
          :editing="false"
          :step="step"
          :introHighlightOnFullNameField="introHighlightOnFullNameField"
          v-on:submit="submit"
      >
      </ChangePerson>
    </v-window-item>
    <v-window-item :value="2">
      <ChangePerson
          :editing="false"
          :step="step"
          :introHighlightOnFullNameField="introHighlightOnFullNameField"
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
                      :introHighlightOnCheckbox="introHighlightOnCheckbox"
                  >
                  </BlessingSteps>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="add-contact-btn" color="primary" @click="addBlessingSteps">Add</v-btn>
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
    mounted () {
      if (this.$store.state.tutorial) {
        setTimeout(() => {
          this.intro = this.$intro()
          this.intro.setOptions({
            showStepNumbers: false,
            doneLabel: 'Skip',
            steps: [
              {
                intro: 'This is your Add Contact page.'
              },
              {
                element: document.querySelector('.full-name-text-field'),
                intro: 'Go ahead and type in the name of your first contact.'
              },
              {
                element: document.querySelector('.add-spouse-btn'),
                intro: `Push the Add Spouse button to add your contact's spouse to your contact list.`
              }
            ]
          }).onchange(targetElement => {
            this.introHighlightOnFullNameField = targetElement.className.includes('full-name-text-field')
          }).onexit(() => {
            this.introHighlightOnFullNameField = false
          }).start()
        }, 1000)
      }
    },
    data () {
      return {
        step: 1,
        subjectId: null,
        objectId: null,
        blessingSteps: [],
        dateFormat: 'MM/DD/YYYY',
        introHighlightOnFullNameField: false,
        introHighlightOnCheckbox: false,
        intro: null
      }
    },
    methods: {
      async submit (person, addAnother) {
        if (this.$store.state.tutorial) this.intro.exit()

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
          if (this.$store.state.tutorial) {
            setTimeout(() => {
              this.intro = this.$intro()
              this.intro.setOptions({
                showStepNumbers: false,
                doneLabel: 'Skip',
                steps: [
                  {
                    element: document.querySelectorAll('.full-name-text-field')[1],
                    intro: 'Type the spouse\'s name here.'
                  },
                  {
                    element: document.querySelectorAll('.add-contact-btn')[1],
                    intro: `Now push the Add button to add any Blessing steps the couple has completed.`
                  }
                ]
              }).onchange(targetElement => {
                this.introHighlightOnFullNameField = targetElement.className.includes('full-name-text-field')
              }).onexit(() => {
                this.introHighlightOnFullNameField = false
              }).start()
            }, 1000)
          }
        } else {
          this.step = 3
          if (this.$store.state.tutorial) {
            setTimeout(() => {
              this.intro = this.$intro()
              this.intro.setOptions({
                showStepNumbers: false,
                doneLabel: 'Skip',
                steps: [
                  {
                    intro: 'Here you can add any Blessings Steps the couple completed.'
                  },
                  {
                    element: document.querySelector('.holy-wine-checkbox'),
                    intro: 'Click this box to record that this couple has received the Holy Wine.'
                  },
                  {
                    element: document.querySelectorAll('.add-contact-btn')[2],
                    intro: 'Finally push the Add button to add this couple to your contact list.'
                  }
                ]
              }).onchange(targetElement => {
                this.introHighlightOnCheckbox = targetElement.className.includes('holy-wine-checkbox')
              }).onexit(() => {
                this.introHighlightOnCheckbox = false
              }).start()
            }, 1000)
          }
        }
      },
      async addBlessingSteps () {
        if (this.$store.state.tutorial) this.intro.exit()
        for (const step of this.blessingSteps.filter(step => step.selected)) {
          await this.$axios.$post('actions', {
            personIds: [this.objectId, this.subjectId],
            actionTypeId: step.id,
            date: moment(step.date)
          })
        }

        this.$router.push('/listguests')
      }
    }
  }
</script>

<style>
  @media (max-width: 500px) {
    .introjs-helperNumberLayer {
      left: 0px !important;
      top: -10px !important;
    }

    .introjs-tooltip {
      margin-top: 40px !important;
    }
  }
</style>
