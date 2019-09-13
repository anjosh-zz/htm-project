<template>
  <span>
    <v-btn color="secondary" @click="showSnapshot">{{this.avatarSrc ? 'Change picture' : 'Add picture'}}</v-btn>
    <v-layout row justify-center>
      <v-dialog v-model="showDialog" :max-width="dialogMaxWidth" :fullscreen="$vuetify.breakpoint.xsOnly"
                transition="slide-y-transition">
        <v-card>
          <v-card-title primary-title>
            <span class="headline">Add a Picture</span>
          </v-card-title>
          <v-card-text>
            <div class="text-xs-center">
              <no-ssr>
                <croppa
                    ref="croppa"
                    @file-choose="handleCroppaFileChoose"
                    placeholder="Loading picture..."
                    :placeholder-font-size="16"
                    :height="imageHeight"
                    :width="imageHeight"
                    :initial-image="imageSrc"
                    :show-remove-button="false"
                    :prevent-white-space="true"
                    :disable-click-to-choose="true"
                    :disable-drag-and-drop="true"
                    :show-loading="true"
                    :zoom-speed="5"
                    :accept="'image/*'"
                >
                </croppa>
              </no-ssr>
            </div>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="hideSnapshot">Close</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="crop" v-if="snapshotTaken">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </span>
</template>

<script>
  export default {
    props: ['avatarSrc'],
    data () {
      return {
        showSnapshotDialog: false,
        imageSrc: '',
        localMediaStream: null,
        snapshotTaken: false
      }
    },
    computed: {
      dialogMaxWidth () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return null
          default:
            return '500px'
        }
      },
      imageHeight () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
            return 300
          default:
            return 400
        }
      },
      showDialog () {
        return this.snapshotTaken && this.showSnapshotDialog
      }
    },
    methods: {
      handleCroppaFileChoose () {
        this.snapshotTaken = true
      },
      crop () {
        this.addImage()
        this.hideSnapshot()
      },
      addImage () {
        this.$emit('addImage', this.$refs.croppa.generateDataUrl('image/jpeg'))
        this.imageSrc = ''
      },
      showSnapshot () {
        this.$refs.croppa.chooseFile()
        this.showSnapshotDialog = true
      },
      hideSnapshot () {
        this.showSnapshotDialog = false
      }
    }
  }
</script>
