<template>
  <div class="avatar-holder" v-if="compressedImage" @click="downloadImage">
    <a :download="person.fullname" ref="imageLink">
      <img :src="compressedImage">
      <v-btn class="download-icon" icon>
        <v-icon class="white--text" >fas fa-arrow-alt-circle-down</v-icon>
      </v-btn>
    </a>
  </div>
  <span v-else :class="person.colorClassName" class="white--text headline">{{person.firstLetter}}</span>
</template>

<script>
  export default {
    props: ['person'],
    computed: {
      compressedImage () {
        const { avatarThumbnail, avatar, avatarURL } = this.person
        return avatarThumbnail || avatar || avatarURL
      }
    },
    methods: {
      async downloadImage () {
        if (!this.person.avatar) {
          this.person.avatar = await this.$axios.$get('/persons/' + this.person.id + '/fullImage')
        }
        const a = this.$refs.imageLink
        a.href = this.person.avatar
        a.click()
      }
    }
  }
</script>

<style scoped>
  .avatar-holder {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
  }
  .avatar-holder a {
    pointer-events: none;
  }
  .download-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    margin: 0;
    display: none;
  }
  .avatar-holder:hover .download-icon {
    display: block;
  }
  a {
    width: 100%;
    height: 100%;
  }
</style>