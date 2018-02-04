<style lang="" scoped>
  video {
    width: 100%;
  }
</style>

<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" :max-width="dialogMaxWidth" :fullscreen="$vuetify.breakpoint.xsOnly" transition="slide-y-transition">
      <v-card>
        <v-card-title primary-title>
          <span  class="headline">Add a Picture</span>
        </v-card-title>
        <v-card-text>
          <div v-show="cameraRunning">
            <video autoplay ref="video"></video>

            <canvas ref="canvas" v-show="false"></canvas>
          </div>
          <div v-show="snapshotTaken">
            <vue-croppie
              ref=croppieRef
              :enableResize="false"
              :enableOrientation="true"
              :viewport="{ width: 256, height: 256, type: 'square' }">
            </vue-croppie>
          </div>
          <div v-if="!cameraRunning && !snapshotTaken">
            <v-container fluid class="pt-0 text-xs-center">
              <v-layout row>
                <v-flex xs6>
                  <v-btn fab dark large color="primary" @click.native="startCamera">
                    <v-icon dark>photo_camera</v-icon>
                  </v-btn>
                  <p>Take picture</p>
                </v-flex>
                <v-flex xs6>
                  <v-btn fab dark large color="secondary" @click.native="openFileInput">
                    <v-icon dark>photo</v-icon>
                  </v-btn>
                  <input
                    ref="image"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    @change="setImage"
                  >
                  <p>Upload</p>
                </v-flex>
              </v-layout>
            </v-container>
            <!-- <v-btn color="green darken-1" flat="flat" @click.native="startCamera" v-if="!cameraRunning">Camera</v-btn> -->

          </div>



        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="hideSnapshot">Close</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="crop" v-if="snapshotTaken">Save</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="takeSnapshot" v-if="cameraRunning">Take picture</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    props: ['showSnapshot'],
    data () {
      return {
        dialog: false,
        cameraRunning: false,
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
            return '300px'
          default:
            return '200px'
        }
      }
    },
    methods: {
      reset () {
        this.cameraRunning = false
        this.snapshotTaken = false
        this.localMediaStream = null
        this.imageSrc = ''
      },
      setImage () {
        const files = this.$refs.image.files
        this.setupCroppie(window.URL.createObjectURL(files[0]))
      },
      openFileInput () {
        this.$refs.image.click()
      },
      setupCroppie (imageSrc) {
        this.imageSrc = imageSrc
        this.cameraRunning = false
        this.snapshotTaken = true
        this.$refs.croppieRef.bind({
          url: imageSrc
        })
      },
      crop () {
        this.$refs.croppieRef.result({}, (output) => {
          this.imageSrc = output
          this.addImage()
          this.hideSnapshot()
        })
      },
      stopCamera () {
        if (this.localMediaStream) {
          let tracks = this.localMediaStream.getTracks()
          tracks[0].stop()
        }
      },
      takeSnapshot () {
        if (this.localMediaStream) {
          let video = this.$refs.video
          let canvas = this.$refs.canvas
          let ctx = canvas.getContext('2d')
          let w, h, ratio
          // Calculate the ratio of the video's width to height
          ratio = video.videoWidth / video.videoHeight
          // Define the required width as 100 pixels smaller than the actual video's width
          w = video.videoWidth - 100
          // Calculate the height based on the video's width and the ratio
          h = parseInt(w / ratio, 10)
          // Set the canvas width and height to the values just calculated
          canvas.width = w
          canvas.height = h

          // Define the size of the rectangle that will be filled (basically the entire element)
          ctx.fillRect(0, 0, w, h)
          // Grab the image from the video
          ctx.drawImage(video, 0, 0, w, h)
          this.stopCamera()
          this.setupCroppie(canvas.toDataURL('image/png'))
        }
      },
      startCamera () {
        this.cameraRunning = true
        let video = this.$refs.video
        this.localMediaStream = null

        // Not showing vendor prefixes or code that works cross-browser.
        navigator.getUserMedia({video: true}, (stream) => {
          video.src = window.URL.createObjectURL(stream)
          this.localMediaStream = stream
        }, (err) => {
          console.log(err)
        })
      },
      addImage () {
        this.$emit('addImage', this.imageSrc)
        this.imageSrc = ''
      },
      hideSnapshot () {
        this.dialog = false
        this.$emit('close')
      }
    },
    watch: {
      dialog (cameraIsShowing) {
        if (!cameraIsShowing) {
          this.$emit('close')
        }
        this.stopCamera()
        this.reset()
      },
      showSnapshot (showSnapshot) {
        this.dialog = showSnapshot
      }
    }
  }
</script>
