<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm5>
      <v-alert
          v-model="showError"
          type="error"
          transition="slide-y-transition"
          dismissible
      >
        Your Spreadsheet did not match the Blessing Tracker template format.
        Please download the Blessing Tracker template and fill it out.
      </v-alert>
      <v-card>
        <v-card-title class="headline">Import Contacts</v-card-title>
        <div v-if="this.headersMatch && this.uploaded">
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <p>Are you sure you want to import {{couples.length}} couple(s)?</p>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :loading=loading @click="submit">Import</v-btn>
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <p>
                  Upload your filled out Blessing Tracker Excel Spreadsheet.
                  You can download the Blessing Tracker template
                  <a href="http://dpdojo.com/wp-content/uploads/2016/03/Blessing-Tracker-6-23-17.xlsx">here</a>.
                </p>
                <p class="grey--text">
                  <span class="font-weight-medium">Notice: </span>
                  If you import existing contacts again, you will see duplicate contacts. You may delete duplicate
                  contacts manually at any time.
                </p>
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
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import XLSX from 'xlsx'
  import moment from 'moment'

  export default {
    data: () => {
      return {
        uploaded: false,
        loading: false,
        couples: [],
        headersMatch: true,
        showError: false,
        sheetdata: [],
        people: [],
        actions: [],
        headersOffset: false
      }
    },
    computed: {
      expectedHeaders () {
        let result = {
          0: 'Details',
          2: 'Spiritual Parent',
          4: 'New Blessed Couple\'s Names',
          8: 'Demographics',
          12: 'Contact Info',
          22: 'Blessing Steps Completed (Enter Date)',
          30: 'Children'
        }
        if (this.headersOffset) {
          Object.keys(result).forEach(key => {
            result[parseInt(key) + 1] = result[key]
            delete result[key]
          })
        }
        return result
      },
      spreadsheetFieldsPositions () {
        let result = {
          husband: {
            firstName: 4,
            birthdate: 8,
            cellPhone: 12,
            email: 15,
            notes: 28
          },
          wife: {
            firstName: 6,
            birthdate: 10,
            cellPhone: 13,
            email: 16,
            notes: 28
          }
        }
        if (this.headersOffset) {
          for (const key in result) {
            for (const spouse in result[key]) {
              result[key][spouse]++
            }
          }
        }
        return result
      },
      blessingStepsFieldsPositionToActionTypeId () {
        let result = [
          [22, 5],
          [23, 1],
          [24, 2],
          [25, 3],
          [26, 6],
          [27, 7]
        ]
        if (this.headersOffset) {
          result.forEach(map => map[0]++)
        }
        return result
      }
    },
    methods: {
      openFileInput () {
        this.$refs.upload.click()
      },
      async upload () {
        const files = this.$refs.upload.files
        await this.readFile(files[0])

        if (this.headersMatch) {
          const NUMBER_OF_HEADER_ROWS = 2

          const createPerson = (row, isHusband) => {
            const fieldsPositions = isHusband ? this.spreadsheetFieldsPositions.husband
              : this.spreadsheetFieldsPositions.wife

            const person = {gender: isHusband}

            person.fullname = ''
            if (row[fieldsPositions.firstName]) {
              person.fullname += `${row[fieldsPositions.firstName]} `
            }
            // get lastname
            if (row[fieldsPositions.firstName + 1]) {
              person.fullname += row[fieldsPositions.firstName + 1]
            }
            const birthdate = row[fieldsPositions.birthdate]
            if (birthdate && moment(birthdate).isValid()) {
              person.birthdate = moment(row[fieldsPositions.birthdate])
            }

            if (row[fieldsPositions.email]) {
              person.email = row[fieldsPositions.email]
            }

            if (row[fieldsPositions.cellPhone]) {
              person.phoneNumber = row[fieldsPositions.cellPhone]
            }

            if (row[fieldsPositions.notes]) {
              person.notes = row[fieldsPositions.notes]
            }

            return person
          }

          const HUSBAND_WIFE_RELATIONSHIP_TYPE_ID = 1

          for (const row of this.sheetdata.slice(NUMBER_OF_HEADER_ROWS)) {
            const husband = createPerson(row, true)
            const wife = createPerson(row, false)
            const couple = {RelationshipTypeId: HUSBAND_WIFE_RELATIONSHIP_TYPE_ID}
            if (husband.fullname || husband.fullname.length > 0) {
              couple.subjectIndex = this.people.push(husband) - 1
            }
            if (wife.fullname || wife.fullname.length > 0) {
              couple.objectIndex = this.people.push(wife) - 1
            }

            // at least one person in the couple exists
            if ('objectIndex' in couple || 'subjectIndex' in couple) {
              couple.actions = []
              for (const [fieldPosition, actionTypeId]
                of this.blessingStepsFieldsPositionToActionTypeId) {
                if (row[fieldPosition]) {
                  if (row[fieldPosition] === 'Yes' || moment(row[fieldPosition]).isValid()) {
                    const action = {}
                    action.ActionTypeId = actionTypeId
                    if (moment(row[fieldPosition]).isValid()) {
                      action.timestamp = moment(row[fieldPosition])
                    }
                    couple.actions.push(action)
                  }
                }
              }

              this.couples.push(couple)
            }
          }
        }

        this.uploaded = true
        this.$refs.upload.value = null
      },
      readFile (file) {
        this.headersMatch = true
        this.showError = false
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, {type: 'array'})
            this.sheetdata = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})
            let headersMatchExpected = Object.keys(this.expectedHeaders)
              .every(index => this.sheetdata[0][index] === this.expectedHeaders[index])
            if (!headersMatchExpected) {
              this.headersOffset = true
              headersMatchExpected = Object.keys(this.expectedHeaders)
                .every(index => this.sheetdata[0][index] === this.expectedHeaders[index])
              if (!headersMatchExpected) {
                this.headersMatch = false
                this.showError = true
              }
            }
            resolve()
          }

          reader.readAsArrayBuffer(file)
        })
      },
      async submit () {
        this.loading = true
        const createdPeople = await this.$axios.$post('/persons/bulkCreate', this.people)

        const relationships = []
        const actions = []
        for (const couple of this.couples) {
          if ('subjectIndex' in couple) {
            couple.SubjectId = createdPeople[couple.subjectIndex].id
          }
          if ('objectIndex' in couple) {
            couple.ObjectId = createdPeople[couple.objectIndex].id
          }
          if ('objectIndex' in couple && 'subjectIndex' in couple) {
            relationships.push(couple)
          }

          couple.actions.forEach(action => {
            action.personIds = []
            if ('SubjectId' in couple) {
              action.personIds.push(couple.SubjectId)
            }
            if ('ObjectId' in couple) {
              action.personIds.push(couple.ObjectId)
            }
            actions.push(action)
          })
        }

        await this.$axios.$post('relationships', relationships)

        await this.$axios.$post('actions', actions)

        this.loading = false

        this.$router.push('/listguests')
      }
    }
  }
</script>
