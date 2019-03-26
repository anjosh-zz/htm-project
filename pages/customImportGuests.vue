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
  import HeaderAttributeManager from '~/plugins/headerAttributeManager'

  export default {
    beforeMount () {
      this.headerAttributeManager = new HeaderAttributeManager()
      this.setHTMGuestAttributes()
    },
    data: () => {
      return {
        headerAttributeManager: null,
        htmGuestAttributes: [],
        availableHeaders: [],
        attributeSelectErrorMessages: [],
        headerSelectErrorMessages: [],
        selectedGuestAttribute: null,
        selectedHeader: null,
        imported: false
      }
    },
    computed: {
      currentlyUsedMappings () {
        return this.headerAttributeManager.getCurrentlyUsedMappings()
      }
    },
    methods: {
      setHTMGuestAttributes () {
        this.htmGuestAttributes = this.headerAttributeManager.getAvailableAttributes()
      },
      setAvailableHeaders () {
        this.availableHeaders = this.headerAttributeManager.getAvailableHeaders()
      },
      addMapping () {
        if (!this.selectedGuestAttribute || !this.selectedHeader) {
          !this.selectedHeader && this.headerSelectErrorMessages.push('Please select an option')
          !this.selectedGuestAttribute && this.attributeSelectErrorMessages.push('Please select an option')
          return
        }
        this.headerAttributeManager.selected(this.selectedHeader, this.selectedGuestAttribute)

        this.setHTMGuestAttributes()
        this.setAvailableHeaders()
        this.selectedGuestAttribute = null
        this.selectedHeader = null
      },
      removeMapping (index) {
        this.headerAttributeManager.removeMapping(index)
        this.setHTMGuestAttributes()
        this.setAvailableHeaders()
      },
      clearSelectErrorMessages () {
        this.headerSelectErrorMessages = []
        this.attributeSelectErrorMessages = []
      },
      openFileInput () {
        this.$refs.upload.click()
      },
      async upload () {
        const files = this.$refs.upload.files
        const file = files[0]
        await this.headerAttributeManager.upload(file)

        this.imported = true

        this.setHTMGuestAttributes()
        this.setAvailableHeaders()
      },
      async submit () {
        await this.headerAttributeManager.submit()

        this.$router.push('/listguests')
      }
    }
  }
</script>
