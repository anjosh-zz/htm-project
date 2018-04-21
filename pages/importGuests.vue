<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Import Guests</v-card-title>
        <div v-if="!imported">
          <v-card-text>
            Upload an xlsx or csv.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openFileInput">Upload</v-btn>
            <input
              ref="upload"
              type="file"
              accept=".csv, .xls, .xlsx"
              @change="upload"
            >
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text>
            Match the file headers to the MyTribe Database:
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submit">Import</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import ChangePerson from '~/components/changePerson.vue'
  import axios from '~/plugins/axios'
  // import XLSX from 'xlsx'

  export default {
    middleware: 'auth',
    data: () => {
      return {
        imported: false
      }
    },
    components: {ChangePerson},
    methods: {
      openFileInput () {
        this.$refs.upload.click()
      },
      upload () {
        this.imported = true
        // const files = this.$refs.upload.files
      },
      submit (person) {
        axios.post('/persons/create', person)
          .then((response) => {
            console.log(response)
            this.$router.push('/listguests')
          })
      }
    }
  }
</script>
