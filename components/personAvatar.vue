<template>
  <img v-if="person.avatar" v-bind:src="person.avatar">
  <img v-else-if="person.avatarURL" v-bind:src="person.avatarURL">
  <span v-else :class="person.colorClassName" class="white--text headline">{{person.firstLetter}}</span>
</template>

<script>
  export default {
    props: ['person']
  }
</script>
