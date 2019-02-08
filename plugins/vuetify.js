import Vue from 'vue'

import {
  Vuetify,
  VApp,
  VCard,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTextField,
  VForm,
  VMenu,
  VDatePicker,
  VDialog,
  VBtnToggle,
  VDivider,
  VAvatar,
  VSubheader,
  VCheckbox
} from 'vuetify'

Vue.use(Vuetify, {
  theme: {
    primary: '#9C27B0',
    accent: '#CE93D8',
    secondary: '#607D8B',
    info: '#0D47A1',
    warning: '#FFB300',
    error: '#B71C1C',
    success: '#2E7D32'
  },
  components: {
    VApp,
    VCard,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTextField,
    VForm,
    VMenu,
    VDatePicker,
    VDialog,
    VBtnToggle,
    VDivider,
    VAvatar,
    VSubheader,
    VCheckbox
  }
})
