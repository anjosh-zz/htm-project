<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" :max-width="dialogMaxWidth" :fullscreen="$vuetify.breakpoint.xsOnly" transition="slide-y-transition">
      <v-card>
        <v-card-media :src="profilePic" :height="imageHeight">
          <v-container fluid class="full-height">
            <v-layout row>
              <v-flex xs6>
                <v-btn
                  flat
                  icon
                  color="grey"
                  class="ma-0"
                  @click.native="hideProfile"
                >
                  <v-icon  v-bind:class="[imageTextColor]">arrow_back</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs6 class="text-xs-right">
                <v-btn
                  flat
                  icon
                  color="grey"
                  class="ma-0"
                  @click.native="hideProfile"
                >
                  <!-- <v-icon  v-bind:class="[imageTextColor]"  @click.native="hideProfile">edit</v-icon> -->
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-title primary-title>
          <span  v-bind:class="['headline']">{{person.fullname}}</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid grid-list-xs>
            <v-layout row justify-center v-if="person.email">
              <v-flex xs12>
                <p><span class="pr-2"><v-icon large>email</v-icon></span>{{person.email}}</p>
              </v-flex>
            </v-layout>
            <v-layout row justify-center v-if="person.phoneNumber">
              <v-flex xs12>
                <p><span class="pr-2"><v-icon large>phone</v-icon></span>{{person.phoneNumber}}</p>
              </v-flex>
            </v-layout>
            <v-layout row justify-center v-if="person.birthdate">
              <v-flex xs12>
                <p><span class="pr-2"><v-icon large>cake</v-icon></span>{{person.birthdate}}</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="hideProfile">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    props: ['showProfile', 'person'],
    data () {
      return {
        dialog: false,
        darkImage: false
      }
    },
    computed: {
      profilePic () {
        return this.person.avatar || this.person.avatarURL
      },
      dialogMaxWidth () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return null
          default:
            return '290px'
        }
      },
      imageHeight () {
        if (!this.profilePic) {
          return '50px'
        }
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '300px'
          default:
            return '200px'
        }
      },
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
          profilePicCheck = this.isItDark(this.profilePic)
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
