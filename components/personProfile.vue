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

        <v-list>
          <div v-for="item in profileInfo" v-if="person[item.personFieldName]">
            <v-divider></v-divider>
            <v-list-tile :href="item.href" target="_blank">
              <v-list-tile-action>
                  <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{person[item.personFieldName]}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>
        </v-list>
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
        darkImage: false,
        emailSubject: 'Congratulations on receiving The Marriage Blessing'
      }
    },
    computed: {
      profileInfo () {
        return [
          {
            personFieldName: 'email',
            icon: 'email',
            href: `mailto:${this.person.email}?subject=${this.emailSubject}&body=${this.emailBody}`
          },
          {
            personFieldName: 'phoneNumber',
            icon: 'phone',
            href: `tel:${this.person.phoneNumber}`
          },
          {
            personFieldName: 'birthdate',
            icon: 'cake'
          }
        ]
      },
      firstName () {
        return this.person.fullname ? this.person.fullname.split(' ')[0] : ''
      },
      emailBody () {
        return encodeURI(`Hello ${this.firstName},\n
Big congratulations on receiving The Marriage Blessing!\n
Because this is such an important occasion I wanted to share a very short video series that explains how the
Blessing can be a foundation for a happy and lasting marriage.\n
Here is the link:
https://ym426-617b2e.pages.infusionsoft.net\n
The videos are only 1-2 minutes and the whole thing can be viewed in 10 minutes.\n
Sincerely,`)
      },
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
