<template>
  <v-layout column justify-center align-center class="pt-3 mt-3">
    <v-flex xs12 sm4>
      <v-card>
        <div class="text-xs-center pt-3">
          <img src="/logo1.png" class="mb-1" width="20%"/>
        </div>
        <v-card-title class="headline">Welcome to MyTribe</v-card-title>
        <v-card-text>
          <p>Making it easier to stay in touch with the people that matter most.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="startTutorial">tutorial</v-btn>
          <v-btn class="login-btn" color="primary" @click="submit" v-if="!this.$auth.loggedIn">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    auth: false,
    methods: {
      submit () {
        this.$auth.loginWith('auth0')
      },
      startTutorial () {
        this.startTutorialGlobal()
        const steps = [
          {
            element: document.querySelector('.v-card'),
            intro: 'Welcome to the MyTribe tutorial! Click Next to see how to use MyTribe.'
          }
        ]
        const intro = this.$intro()
        if (!this.$auth.loggedIn) {
          steps.push({
            element: document.querySelector('.login-btn'),
            intro: 'Click the Login button to sign up if you do not have an account or login if you do.'
          })
        } else {
          intro.oncomplete(() =>
            this.$router.push('/listguests')
          )
        }
        intro.setOptions({
          showStepNumbers: false,
          steps: steps,
          doneLabel: 'Next'
        })
        intro.start()
      },
      ...mapMutations({
        startTutorialGlobal: 'startTutorial'
      })
    }
  }
</script>
