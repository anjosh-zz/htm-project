import Vue from 'vue'
import Vuelidate from 'vuelidate'
import isItDark from './isItDark'

Vue.use(Vuelidate)

Vue.mixin({
  methods: {
    isItDark
  }
})
