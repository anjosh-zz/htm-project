<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" max-width="290" transition="slide-y-transition">
      <v-card>
        <v-card-media :src="profilePic" height="200px">
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
                  <v-icon  v-bind:class="[imageTextColor]"  @click.native="hideProfile">edit</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-card-title primary-title>
          <span  v-bind:class="['headline']">Aiden Banks</span>
        </v-card-title>
        <v-card-text>
          <div>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
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
