<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-media :src="profilePic" height="200px">
          <v-container fluid class="full-height">
            <v-layout row>
              <v-flex xs12>
                <v-icon  v-bind:class="[imageTextColor]">arrow_back</v-icon>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 class="sticky-bottom">
                <span  v-bind:class="[imageTextColor, 'headline']">Aiden Banks</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-title>
        <v-card-actions>
        <v-btn color="green darken-1" flat="flat" @click.native="hideProfile">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    props: ['showProfile', 'personId'],
    data () {
      return {
        dialog: false,
        profilePic: '/images/87.jpg',
        darkImage: false
      }
    },
    computed: {
      imageTextColor () {
        return this.darkImage ? 'white--text' : 'black--text'
      }
    },
    methods: {
      hideProfile () {
        this.$emit('close')
      }
    },
    watch: {
      dialog (profileIsShowing) {
        if (!profileIsShowing) {
          this.$emit('close')
        }
      },
      showProfile (showProfile) {
        let profilePicCheck = Promise.resolve()
        if (showProfile) {
          profilePicCheck = this.isItDark('/images/87.jpg')
            .then((isDark) => {
              this.darkImage = isDark
            })
        }
        profilePicCheck
          .then(() => {
            this.dialog = showProfile
          })
      }
    }
  }
</script>
