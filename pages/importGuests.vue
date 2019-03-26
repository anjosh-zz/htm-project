<template>
  <v-layout row align-center justify-center class="pt-3 mt-3">
    <v-flex xs12 md4>
      <v-card>
        <v-card-title class="headline">Import Guests</v-card-title>
        <div v-if="!imported">
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <p>Upload your filled out Blessing Tracker Excel Spreadsheet.
                  You can download a the Blessing Tracker template
                  <a href="http://dpdojo.com/wp-content/uploads/2016/03/Blessing-Tracker-6-23-17.xlsx">here</a>.
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
        <div v-else>
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <p>Are you sure you want to import {{couples.length}} couple(s)?</p>
              </v-flex>
            </v-layout>
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
  import XLSX from 'xlsx'
  import moment from 'moment'

  const EXPECTED_HEADERS = {
    1: 'Details',
    3: 'Spiritual Parent',
    5: 'New Blessed Couple\'s Names',
    9: 'Demographics',
    13: 'Contact Info',
    23: 'Blessing Steps Completed (Enter Date)',
    31: 'Children'
  }

  const SPREADSHEET_FIELDS_POSITIONS = {
    husband: {
      firstName: 5,
      birthdate: 9,
      cellPhone: 13,
      email: 16,
      notes: 29
    },
    wife: {
      firstName: 7,
      birthdate: 11,
      cellPhone: 14,
      email: 17,
      notes: 29
    }
  }

  const BLESSING_STEPS_FIELDS_POSITION_TO_ACTION_TYPE_ID = [
    [23, 5],
    [24, 1],
    [25, 2],
    [26, 3],
    [27, 6],
    [28, 7]
  ]

  export default {
    data: () => {
      return {
        imported: false,
        couples: [],
        headersMatch: true,
        sheetdata: [],
        people: [],
        actions: []
      }
    },
    methods: {
      openFileInput () {
        this.$refs.upload.click()
      },
      async upload () {
        const files = this.$refs.upload.files
        await this.readFile(files[0])

        const NUMBER_OF_HEADER_ROWS = 2

        const createPerson = (row, isHusband) => {
          const fieldsPositions = isHusband ? SPREADSHEET_FIELDS_POSITIONS.husband
            : SPREADSHEET_FIELDS_POSITIONS.wife

          const person = { gender: isHusband }

          person.fullname = ''
          if (row[fieldsPositions.firstName]) {
            person.fullname += `${row[fieldsPositions.firstName]} `
          }
          // get lastname
          if (row[fieldsPositions.firstName + 1]) {
            person.fullname += row[fieldsPositions.firstName + 1]
          }

          if (row[fieldsPositions.birthdate]) {
            person.birthdate = row[fieldsPositions.birthdate]
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
          const couple = { RelationshipTypeId: HUSBAND_WIFE_RELATIONSHIP_TYPE_ID }
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
              of BLESSING_STEPS_FIELDS_POSITION_TO_ACTION_TYPE_ID) {
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

        this.imported = true
      },
      readFile (file) {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, {type: 'array'})
            this.sheetdata = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})
            const headersMatchExpected = Object.keys(EXPECTED_HEADERS)
              .every(index => this.sheetdata[0][index] === EXPECTED_HEADERS[index])
            if (!headersMatchExpected) {
              this.headersMatch = false
            }
            resolve()
          }

          reader.readAsArrayBuffer(file)
        })
      },
      async submit () {
        const createdPeople = await this.$axios.$post('/persons/bulkCreate', this.people)
        console.log(createdPeople)

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

        const createdRelationships = await this.$axios.$post('relationships', relationships)
        console.log(createdRelationships)

        const createdActions = await this.$axios.$post('actions', actions)
        console.log(createdActions)

        this.$router.push('/listguests')
      }
    }
  }
</script>
