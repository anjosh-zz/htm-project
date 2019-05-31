<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout
      align-center
      justify-space-around
      wrap>
    <v-dialog v-model="dialog" :max-width="dialogMaxWidth" :fullscreen="$vuetify.breakpoint.xsOnly"
              transition="slide-y-transition">
      <v-card>
        <v-container fluid class="full-height">
          <v-layout row>
            <v-flex xs6>
              <v-btn icon @click="hideProfile">
                <v-icon class="black--text">arrow_back</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn icon @click="showDeleteDialog">
                <v-icon color="black--text">delete</v-icon>
              </v-btn>
              <v-btn icon @click="openEditPage">
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
          <span class="headline">{{person.fullname}}</span>
        </v-card-title>

        <v-list>
          <div v-for="item in profileInfo" v-if="item.value">
            <v-divider></v-divider>
            <v-tooltip bottom :disabled="item.tooltip === undefined">
              <template v-slot:activator="{ on }">
                <v-list-tile v-on="on" :href="item.href" @click="item.handleClick" target="_blank">
                  <v-list-tile-action>
                    <v-layout align-center justify-space-around>
                      <v-icon class="mr-4">{{item.icon}}</v-icon>
                    </v-layout>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.value}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text" v-if="item.timestamp">
                    {{item.timestamp.format('MMM Do, YYYY')}}
                  </v-list-tile-action>
                  <v-list-tile-action v-else-if="item.actionIcon">
                    <v-icon>{{item.actionIcon}}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <span>{{item.tooltip}}</span>
            </v-tooltip>
          </div>
          <v-divider></v-divider>
        </v-list>
        <v-list two-line class="pt-0" v-if="person.notes">
          <v-list-tile>
            <v-list-tile-action>
              <v-layout align-center>
                <v-icon class="mr-4">subject</v-icon>
              </v-layout>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{person.notes}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import moment from 'moment'
  import googlePhoneNumberLib from 'google-libphonenumber'
  import Avatar from '~/components/personAvatar.vue'

  const phoneUtil = googlePhoneNumberLib.PhoneNumberUtil.getInstance()
  const PNF = googlePhoneNumberLib.PhoneNumberFormat

  export default {
    components: {Avatar},
    props: ['showProfile', 'person'],
    data () {
      return {
        dialog: false,
        darkImage: false,
        emailSubject: 'Congratulations on receiving The Marriage Blessing',
        blessingStepsIconMap: {
          1: 'fa-wine-glass',
          2: 'fa-praying-hands',
          3: 'fa-magic',
          4: 'fa-book',
          5: 'fa-hand-holding-usd',
          6: 'far fa-heart',
          7: 'fas fa-heart'
        }
      }
    },
    computed: {
      profileInfo () {
        let result = []
        if (this.person.email) {
          result.push({
            value: this.person.email,
            icon: 'email',
            actionIcon: 'send',
            href: `mailto:${this.person.email}?subject=${this.emailSubject}&body=${this.emailBody}`,
            tooltip: 'Click to send a congratulatory email',
            handleClick: () => {}
          })
        }
        if (this.person.phoneNumber) {
          const number = phoneUtil.parseAndKeepRawInput(this.person.phoneNumber, 'US')
          result.push({
            value: phoneUtil.format(number, PNF.NATIONAL),
            icon: 'phone',
            href: `tel:${this.person.phoneNumber}`,
            tooltip: 'Click to call',
            handleClick: () => {}
          })
        }
        if (this.person.birthdate) {
          result.push({
            value: moment(this.person.birthdate).format('MM/DD/YYYY'),
            icon: 'cake',
            handleClick: () => {}
          })
        }
        if (this.person.RelationshipObject || this.person.RelationshipSubject) {
          const relationships = this.person.RelationshipObject.concat(this.person.RelationshipSubject)
          const spouseRelationship = relationships.find(r => r && r.RelationshipTypeId === 1)
          if (spouseRelationship) {
            const spouse = spouseRelationship.Object ? spouseRelationship.Object : spouseRelationship.Subject
            result.push({
              value: spouse.fullname,
              icon: 'wc',
              handleClick: () => (this.person = spouse)
            })
          }
        }

        let actions = []
        if (this.person.Object) {
          this.person.Object.forEach((action) => actions.push(action))
        }
        if (this.person.Subject) {
          this.person.Subject.forEach((action) => actions.push(action))
        }
        actions.sort((a, b) => a.ActionTypeId - b.ActionTypeId)
          .forEach(step => {
            const item = {
              value: step.ActionType.name,
              icon: this.blessingStepsIconMap[step.ActionTypeId]
            }
            if (step.timestamp) {
              item.timestamp = moment(step.timestamp)
            }
            item.handleClick = () => {
              this.hideProfile()
              this.$router.push({
                name: 'actionDetails',
                params: {
                  actionId: step.id
                }
              })
            }
            result.push(item)
          })
        return result
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
            return '360px'
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
      },
      showDeleteDialog () {
        this.$emit('delete', this.person)
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
