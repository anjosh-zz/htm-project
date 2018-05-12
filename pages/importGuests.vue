<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Import Guests</v-card-title>
        <div v-if="!imported">
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <p>Upload an Excel Spreadsheet (.xlsx) or a Comma Separated document (.csv).</p>
              </v-flex>
            </v-layout>
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
            <v-layout row>
              <v-flex xs12>
                <p>Match your table headers to the MyTribe Database:</p>
              </v-flex>

            </v-layout>
            <v-layout row>

              <v-flex xs5>
                <v-select
                  :items="availableHeaders"
                  v-model="selectedHeader"
                  :error-messages="headerSelectErrorMessages"
                  @change="clearSelectErrorMessages"
                  label="Headers"
                  single-line
                ></v-select>
              </v-flex>
              <v-flex xs1 text-xs-center pt-4>
                <v-icon>arrow_forward</v-icon>
              </v-flex>
              <v-flex xs5>
                <v-select
                  :items="htmGuestAttributes"
                  v-model="selectedGuestAttribute"
                  :error-messages="attributeSelectErrorMessages"
                  @change="clearSelectErrorMessages"
                  label="Attributes"
                  single-line
                ></v-select>
              </v-flex>

              <v-flex xs1 text-xs-center pt-2>
                <v-btn flat icon color="green" @click="addMapping">
                  <v-icon>playlist_add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <p v-if="currentlyUsedMappings.length">Added mappings:</p>
                <p v-else>Please add mappings by clicking the green button above.</p>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-list>
                  <template v-for="(item, index) in currentlyUsedMappings">
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{item.headerText}} <v-icon>arrow_forward</v-icon> {{item.attributeText}}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn flat icon color="red" @click="removeMapping(index)">
                          <v-icon>remove_circle</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submit" :disabled="!currentlyUsedMappings.length">Import</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from '~/plugins/axios'
  import XLSX from 'xlsx'

  export default {
    middleware: 'auth',
    beforeMount () {
      this.setHTMGuestAttributes()
    },
    data: () => {
      return {
        htmGuestAttributes: [],
        headers: [],
        availableHeaders: [],
        currentlyUsedMappings: [],
        currentlyUsedHeaders: [],
        attributeSelectErrorMessages: [],
        headerSelectErrorMessages: [],
        sheetdata: null,
        selectedGuestAttribute: null,
        selectedHeader: null,
        imported: false
      }
    },
    methods: {
      setHTMGuestAttributes () {
        let links = new Set()
        this.htmGuestAttributes = [
          {value: 'fullname', text: 'Full name', linkedTo: ['firstname', 'lastname']},
          {value: 'firstname', text: 'First name', linkedTo: ['fullname']},
          {value: 'lastname', text: 'Last name', linkedTo: ['fullname']},
          {value: 'alias', text: 'Name they go by'},
          {value: 'email', text: 'Email'},
          {value: 'phoneNumber', text: 'Phone number'},
          {value: 'birthdate', text: 'Birthdate'},
          {value: 'preferredContactMethod', text: 'Preferred contact method'}
          // TODO implement the below options
          // {value: 'firstMeetingLocation', text: 'Meeting location'},
          // {value: 'timeMet', text: 'Date met'},
          // {value: 'notes', text: 'Notes'}
        ].filter(attribute => {
          let isUsed = this.currentlyUsedMappings.find(mapping => mapping.attribute === attribute.value)
          if (isUsed && attribute.linkedTo) {
            attribute.linkedTo.forEach(link => links.add(link))
          }
          return !isUsed
        }).filter(attribute => {
          return !links.has(attribute.value)
        })
      },
      setAvailableHeaders () {
        this.availableHeaders = this.headers.map((header) => ({
          value: header,
          text: header
        })).filter(header => !this.currentlyUsedMappings.find(mapping => mapping.header === header.value))
      },
      removeMapping (index) {
        this.currentlyUsedMappings.splice(index, 1)
        this.setHTMGuestAttributes()
        this.setAvailableHeaders()
      },
      clearSelectErrorMessages () {
        this.headerSelectErrorMessages = []
        this.attributeSelectErrorMessages = []
      },
      addMapping () {
        if (!this.selectedGuestAttribute || !this.selectedHeader) {
          !this.selectedHeader && this.headerSelectErrorMessages.push('Please select an option')
          !this.selectedGuestAttribute && this.attributeSelectErrorMessages.push('Please select an option')
          return
        }
        let selectedHeaderObject = this.availableHeaders.find(item => item.value === this.selectedHeader)
        let selectedGuestAttributeObject = this.htmGuestAttributes.find(item => item.value === this.selectedGuestAttribute)
        if (selectedGuestAttributeObject && selectedHeaderObject) {
          this.currentlyUsedMappings.push({
            attribute: selectedGuestAttributeObject.value,
            attributeText: selectedGuestAttributeObject.text,
            header: selectedHeaderObject.value,
            headerText: selectedHeaderObject.text
          })
          this.setHTMGuestAttributes()
          this.setAvailableHeaders()
          this.selectedGuestAttribute = null
          this.selectedHeader = null
        }
      },
      openFileInput () {
        this.$refs.upload.click()
      },
      upload () {
        const files = this.$refs.upload.files
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (e) => {
          let data = new Uint8Array(e.target.result)
          let workbook = XLSX.read(data, {type: 'array'})
          this.sheetdata = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})
          this.headers = this.sheetdata[0]
          this.setAvailableHeaders()
          this.imported = true
        }
        reader.readAsArrayBuffer(file)
      },
      submit () {
        let keys = this.headers.map((header) => {
          let mapping = this.currentlyUsedMappings.find(mapping => mapping.header === header)
          if (mapping) {
            return mapping.attribute
          }
        })
        let persons = this.sheetdata.slice(1).map((row) => {
          let person = keys.reduce((person, key, index) => {
            if (key) {
              person[key] = row[index]
            }
            return person
          }, {})
          if (keys.includes('firstname') || keys.includes('lastname')) {
            person.fullname = (person.firstname ? `${person.firstname} ` : '') + person.lastname
            delete person.firstname
            delete person.lastname
          }
          return person
        })
        axios.post('/persons/bulkCreate', persons)
          .then((response) => {
            console.log(response)
            this.$router.push('/listguests')
          })
      }
    }
  }
</script>
