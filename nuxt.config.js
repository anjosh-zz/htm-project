const nodeExternals = require('webpack-node-externals')

module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3001'
  },
  serverMiddleware: ['redirect-ssl'],
  /*
  ** Headers of the page
  */
  head: {
    title: 'MyTribe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/globals.js',
    '~/plugins/smallplugins.js',
    { src: '~/plugins/facebook.js', ssr: false },
    { src: '~/plugins/nonssrplugins.js', ssr: false }
  ],
  css: [
    '~/assets/style/app.styl',
    { src: '@fortawesome/fontawesome-free/css/all.css', lang: 'css' },
    { src: 'vue-croppa/dist/vue-croppa.css', lange: 'css' }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  modules: [
    ['@nuxtjs/google-analytics', {
      id: 'UA-134598965-1'
    }],
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  router: {
    middleware: ['auth']
  },
  auth: {
    redirect: {
      callback: '/',
      login: '/',
      logout: '/',
      home: '/addguest'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/local' },
          logout: { url: '/auth/logout' },
          user: { url: '/auth/user' }
        }
      },
      auth0: {
        domain: 'mytribe.auth0.com',
        client_id: 'vaNm-JJMod59JX2Eo2jTtmzYxVFilcTy'
      }
    }
  },
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    credentials: true
  },
  /*
  ** Build configuration
  */
  build: {
    cssSourceMap: false,
    babel: {
      plugins: [
        ['transform-imports', {
          'vuetify': {
            'transform': 'vuetify/es5/components/${member}',
            'preventFullImport': true
          }
        }]
      ]
    },
    vendor: [
      '~/plugins/vuetify.js'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
