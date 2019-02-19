<template>
  <v-layout
    align-center
    justify-space-around
    wrap>
    <v-dialog v-model="dialog" :max-width="dialogMaxWidth" :fullscreen="$vuetify.breakpoint.xsOnly" transition="slide-y-transition">
      <v-card>
        <v-container fluid class="full-height">
          <v-layout row>
            <v-flex xs6>
              <v-btn
                icon
                @click.native="hideProfile"
                >
                <v-icon class="black--text">arrow_back</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn
                icon
                @click.native="openEditPage"
                >
                <v-icon class="black--text">edit</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>

        <v-layout
          align-center
          justify-space-around
          wrap
          >
          <v-avatar :color="person.colorClassName" :size="60">
            <Avatar :person="person"/>
          </v-avatar>

        </v-layout>
        <v-card-title class="justify-center" primary-title>
          <span v-bind:class="['headline']">{{person.fullname}}</span>
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
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Avatar from '~/components/personAvatar.vue'

  export default {
    components: {Avatar},
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
          return 'auto'
        }
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return '300px'
          default:
            return '200px'
        }
      }
    },
    methods: {
      hideProfile () {
        this.$emit('close')
      },
      openEditPage () {
        this.$emit('edit', this.person.id)
      }
    },
    watch: {
      dialog (profileIsShowing) {
        if (!profileIsShowing) {
          this.$emit('close')
        }
      },
      showProfile (showProfile) {
        this.dialog = showProfile
      }
    }
  }
</script>
