// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Theme Definition
const hybridTheme = {
  dark: false, // Light mode base
  colors: {
    background: '#F5F7FA', // Light Grey-Blue
    surface: '#FFFFFF',
    primary: '#000000', // Black for buttons
    'primary-darken-1': '#1a1a1a',
    secondary: '#00E5FF', // Cyan for glows/accents
    success: '#00C853',
    warning: '#FFD600',
    error: '#FF1744',
    info: '#2962FF',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'hybridTheme',
    themes: {
      hybridTheme,
    },
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'flat',
      class: 'text-none font-weight-bold letter-spacing-1',
      rounded: 'lg',
      height: 44,
    },
    VCard: {
      elevation: 0,
      class: 'glass-card',
      rounded: 'lg',
    },
    VNavigationDrawer: {
      color: '#050505', // Explicitly dark
      theme: 'dark', // Force dark mode context for children
      class: 'glass-drawer',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      bgColor: 'transparent',
      class: 'glow-input',
    },
    VApp: {
      background: '#F5F7FA',
    },
  },
})
