import axios from '~/plugins/axios'
import XLSX from 'xlsx'
const smartmap = [
  { keyword: 'first', value: 'firstname' },
  { keyword: 'name', value: '' },
  { keyword: 'email', value: 'email' },
  { keyword: 'phone', value: 'phoneNumber' },
  { keyword: 'number', value: 'phoneNumber' },
  { keyword: 'birth', value: 'birthdate' }
]

const COLUMNS_TO_EXCLUDE = 4
const HEADERS_TO_EXCLUDE = 1

export default class HeaderAttributeManager {
  constructor () {
    this.headers = []
    this.currentlyUsedMappings = []
    this.availableAttributes = []
    this.availableHeaders = []
    this.sheetdata = []
  }

  upload (file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, {type: 'array'})
        this.sheetdata = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})
        this.headers = this.sheetdata[HEADERS_TO_EXCLUDE].slice(COLUMNS_TO_EXCLUDE, 28)

        this.setHeaders(this.headers)
        this.getAvailableAttributes()

        this.performSmartMap()

        resolve()
      }
      reader.readAsArrayBuffer(file)
    })
  }

  setHeaders (headers) {
    this.headers = headers
    this.getAvailableHeaders()
  }

  getAvailableAttributes () {
    let links = new Set()
    let guestAttributes = [
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

    if (!guestAttributes.length) {
      guestAttributes.push({ value: 'none', text: 'All attributes used', disabled: true })
    }
    this.availableAttributes = guestAttributes
    return guestAttributes
  }

  getAvailableHeaders () {
    let availableHeaders = this.headers.map((header) => ({
      value: header,
      text: header
    })).filter(header => !this.currentlyUsedMappings.find(mapping => mapping.header === header.value))

    if (!availableHeaders.length) {
      availableHeaders.push({ value: 'none', text: 'All headers used', disabled: true })
    }
    this.availableHeaders = availableHeaders
    return availableHeaders
  }

  selected (selectedHeader, selectedGuestAttribute) {
    let selectedHeaderObject = this.availableHeaders.find(item => item.value === selectedHeader)
    let selectedGuestAttributeObject = this.availableAttributes.find(item => item.value === selectedGuestAttribute)
    if (selectedGuestAttributeObject && selectedHeaderObject) {
      this.currentlyUsedMappings.push({
        attribute: selectedGuestAttributeObject.value,
        attributeText: selectedGuestAttributeObject.text,
        header: selectedHeaderObject.value,
        headerText: selectedHeaderObject.text
      })
    }
  }

  getCurrentlyUsedMappings () {
    return this.currentlyUsedMappings
  }

  removeMapping (index) {
    this.currentlyUsedMappings.splice(index, 1)
  }

  performSmartMap () {
    let newSmartMappings = []
    let name
    let firstname
    let phone
    let availableHeaders = this.availableHeaders.slice(0)
    smartmap.forEach((smartmapObject) => {
      let foundHeaderIndex = availableHeaders.findIndex(header => header.text.toLowerCase().includes(smartmapObject.keyword))
      if (foundHeaderIndex >= 0) {
        let foundHeader = availableHeaders[foundHeaderIndex]
        availableHeaders.splice(foundHeaderIndex, 1)
        let newSmartMapping = {
          header: foundHeader,
          smartmapObject
        }

        switch (smartmapObject.keyword) {
          case 'first':
            firstname = newSmartMapping
            break
          case 'name':
            name = newSmartMapping
            break
          case 'phone':
          case 'number':
            if (!phone) {
              newSmartMappings.push(newSmartMapping)
            }
            break
          default:
            newSmartMappings.push(newSmartMapping)
        }
      }
    })

    if (name && firstname) {
      let lastnameAttribute = this.availableAttributes.find(attribute => attribute.value === 'lastname')
      this.currentlyUsedMappings.push({
        attribute: lastnameAttribute.value,
        attributeText: lastnameAttribute.text,
        header: name.header.value,
        headerText: name.header.text
      })
      let firstnameAttribute = this.availableAttributes.find(attribute => attribute.value === 'firstname')
      this.currentlyUsedMappings.push({
        attribute: firstnameAttribute.value,
        attributeText: firstnameAttribute.text,
        header: firstname.header.value,
        headerText: firstname.header.text
      })
    } else if (name) {
      let fullnameAttribute = this.availableAttributes.find(attribute => attribute.value === 'fullname')
      this.currentlyUsedMappings.push({
        attribute: fullnameAttribute.value,
        attributeText: fullnameAttribute.text,
        header: name.header.value,
        headerText: name.header.text
      })
    } else if (firstname) {
      let fullnameAttribute = this.availableAttributes.find(attribute => attribute.value === 'fullname')
      this.currentlyUsedMappings.push({
        attribute: fullnameAttribute.value,
        attributeText: fullnameAttribute.text,
        header: firstname.header.value,
        headerText: firstname.header.text
      })
    }

    newSmartMappings.forEach((mapobject) => {
      let attribute = this.availableAttributes.find(attribute => attribute.value === mapobject.smartmapObject.value)
      this.currentlyUsedMappings.push({
        attribute: attribute.value,
        attributeText: attribute.text,
        header: mapobject.header.value,
        headerText: mapobject.header.text
      })
    })
  }

  submit () {
    let keys = this.headers.map((header) => {
      let mapping = this.currentlyUsedMappings.find(mapping => mapping.header === header)
      if (mapping) {
        return mapping.attribute
      }
    })
    let persons = this.sheetdata.slice(HEADERS_TO_EXCLUDE + 1).map((row) => {
      let person = keys.reduce((person, key, index) => {
        if (key) {
          person[key] = row[index + COLUMNS_TO_EXCLUDE]
        }
        return person
      }, {})
      if (keys.includes('firstname') || keys.includes('lastname')) {
        person.fullname = ''
        if (person.firstname) {
          person.fullname += `${person.firstname} `
        }
        if (person.lastname) {
          person.fullname += person.lastname
        }
        person.fullname.trim()
        delete person.firstname
        delete person.lastname
      }
      return person
    }).filter(person => !!person.fullname)
    return axios.post('/persons/bulkCreate', persons)
      .then((response) => {
        console.log(response)
      })
  }
}
