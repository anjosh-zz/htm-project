<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-card-title class="pb-0 headline">Share Content</v-card-title>
        <v-container
            fluid
            grid-list-lg
        >
          <v-layout row wrap>
            <v-flex
                v-for="template in templates"
                :key="template.title"
                xs12
            >
              <v-card v-if="template.img" ripple hover :href="generateHref(template.message)" target="_blank">
                <v-layout>
                  <v-flex xs4>
                    <v-img
                        :src="template.img"
                        class="mx-2"
                        height="80px"
                        contain
                    >
                      <template v-slot:placeholder>
                        <v-layout
                            fill-height
                            align-center
                            justify-center
                            ma-0
                        >
                          <v-progress-circular
                              indeterminate
                              color="grey lighten-2"
                          >
                          </v-progress-circular>
                        </v-layout>
                      </template>
                    </v-img>
                  </v-flex>
                  <v-flex xs8>
                    <div class="pt-2">
                      <div class="font-weight-medium subheading">{{template.title}}</div>
                      <div class="body-1">{{template.type}}</div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
              <v-card v-else dark color="blue darken-1">
                <v-layout
                    align-center
                    justify-center
                    mt-0
                >
                  <v-flex xs1>
                    <div class="text-xs-center">
                      <v-icon class="mx-3">{{template.icon}}</v-icon>
                    </div>
                  </v-flex>

                  <v-flex xs11>
                    <v-card-text class="py-2">
                      <div class="title">{{template.sectionHeader}}</div>
                    </v-card-text>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout align-center row>
                <v-flex><v-divider></v-divider></v-flex>
                <v-flex
                  class="headline font-italic or-text"
                  ><span>or</span></v-flex>
                <v-flex><v-divider></v-divider></v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-card ripple hover :href="generateHref(blankEmail.message)" target="_blank">
                <v-layout>
                  <v-flex xs4>
                    <v-layout
                      class="mx-2 file-icon"
                      align-center
                      justify-center>
                      <v-icon size="36" color="blue darken-1">fas fa-file</v-icon>
                    </v-layout>
                  </v-flex>
                  <v-flex xs8>
                    <div class="pt-2">
                      <div class="font-weight-medium subheading">{{blankEmail.title}}</div>
                      <div class="body-1">{{blankEmail.type}}</div>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  const isIos = require('is-ios')
  const isAndroid = require('is-android')
  const iOsVersion = require('ios-version/current')

  export default {
    data () {
      let spaceAndFirstName = ''
      const people = this.$route.params.people
      if (people && people.length === 1 && people[0].fullname) {
        spaceAndFirstName = ` ${people[0].fullname.split(' ')[0]}`
      }
      return {
        separator: this.detectSmsSeparator(),
        blankEmail: {
          title: 'Write',
          type: 'your own email',
          message: {
            subject: '',
            body: ''
          }
        },
        templates: [
          {
            sectionHeader: 'For Your Newly Blessed Guest',
            icon: 'fa-wine-glass'
          },
          {
            title: 'What is the Blessing?',
            type: 'Video Series',
            img: 'http://tribenet.co/wp-content/uploads/2016/03/tribalmessiah3.png',
            message: {
              subject: 'Congratulations on receiving The Marriage Blessing',
              body: `Hello${spaceAndFirstName},

Big congratulations on receiving The Marriage Blessing!

Because this is such an important occasion I wanted to share a very short video series that explains how the Blessing can be a foundation for a happy and lasting marriage.

Here is the link:
https://ym426-617b2e.pages.infusionsoft.net

The videos are only 1-2 minutes and the whole thing can be viewed in 10 minutes.

Sincerely,`
            }
          },
          {
            sectionHeader: 'For Your Guest in a Relationship',
            icon: 'fa-heart'
          },
          {
            title: 'Blessing America',
            type: 'Website',
            img: 'http://tribenet.co/wp-content/uploads/2019/05/blessingameirca.jpg',
            message: {
              subject: 'Build Great Relationship Habits',
              body: `Hello${spaceAndFirstName},

It has been so great getting to know you.

I just wanted to let you know of a really great resource that I hope you can find useful in your relationship. Blessing America is all about how to build great relationship habits. I know that's important to everyone, so I wanted to share! :-)

If you go to this link you can see a lot of great resources.
https://blessingamerica.org

Let me know when you get a chance to check out the site. I'd love to hear your thoughts.

Sincerely,`
            }
          },
          {
            title: 'Relationship Skills',
            type: 'Quiz',
            img: 'https://tribenet.co/wp-content/uploads/2019/05/skillsquizicon.jpg',
            message: {
              subject: 'Relationship Skills Quiz',
              body: `Hi again

I've been thinking of an interesting question: "What is my best relationship skill?"

I found this quiz that reveals your strengths and weaknesses. I thought I'd share it because relationship self-awareness is so valuable to see how you can improve and be even happier. Partners can take an evening to do the quiz together as valuable couple time (each does it on their own and compares the results).

Here's the link to it:
https://ym426-ebd3e3.pages.infusionsoft.net/

Let me know what you think.

Sincerely,`
            }
          },
          {
            title: 'Blessed Life Challenge',
            type: 'Email Series',
            img: 'https://tribenet.co/wp-content/uploads/2019/05/Artboard-2-copy@3x.png',
            message: {
              subject: 'Relationship Building Challenge',
              body: `Hi again

I've heard many times that "love is a verb." Is it just me...?

That got me wondering, what do I do each day to express love for my partner. It's so easy to get in the habit of the day-to-day and forget to invest in the relationship. I came across this great resource that sends new ideas everyday for 6-weeks.

Hope you don't mind. I just wanted to share, because I want to wish you the best for your relationship. :-)

Here's the link:
https://www.blessingamerica.org/challenge

What do you think?

Sincerely,`
            }
          },
          {
            title: 'More Than Marriage',
            type: 'EBook',
            img: 'https://tribenet.co/wp-content/uploads/2019/05/couplemarriage.jpg',
            message: {
              subject: 'What Makes Marriage Work?',
              body: `Hi${spaceAndFirstName},

How have you been?

A marriage educator that I know, Heather Thalheimer, wrote a book called "More Than Marriage".

I wanted to share because it has an interesting perspective on why some marriages work and some don't. You could buy the copy, but the digital one is free to download right now. Would you be willing to check out the ebook?

Here's the link
https://www.blessingamerica.org/ebook-thank-you

Let me know what you think.

Sincerely,`
            }
          }
        ]
      }
    },
    methods: {
      detectSmsSeparator () {
        const defaultSeparator = '?'

        if (isAndroid) return defaultSeparator
        if (isIos && iOsVersion) {
          return iOsVersion.major < 8 ? ';' : '&'
        }
        return defaultSeparator
      },
      generateHref (message) {
        if (this.$route.params.type === 'sms') {
          let phone = ''
          if (this.$route.params.people) {
            const {people} = this.$route.params
            if (people.length === 1) {
              phone = people[0].phoneNumber
            }
          }
          return `sms:${phone}${this.separator}body=${encodeURIComponent(message.body)}`
        } else {
          let mailto = '?'
          if (this.$route.params.people) {
            const {people} = this.$route.params
            if (people.length === 1) {
              mailto = people[0].email + '?'
            } else if (people.length > 1) {
              mailto = '?bcc=' + people.map(person => person.email).join(',') + '&'
            }
          }
          return `mailto:${mailto}subject=${message.subject}&body=${encodeURIComponent(message.body)}`
        }
      }
    }
  }
</script>

<style scoped>
  .file-icon {
    height: 80px;
    font-size: 36px;
  }
  .or-text {
    max-width: fit-content;
  }
</style>
