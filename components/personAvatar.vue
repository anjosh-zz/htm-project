<template>
  <img v-if="person.avatarThumbnail" :src="person.avatarThumbnail">
  <img v-else-if="person.avatar" :src="person.avatar">
  <img v-else-if="person.avatarURL" :src="person.avatarURL">
  <span v-else :class="person.colorClassName" class="white--text headline">{{person.firstLetter}}</span>
</template>

<script>
  export default {
    props: ['person']
  }
</script>
