const environment = process.env.NODE_ENV || 'development'
const URL =
  environment === 'local'
    ? 'http://localhost:3000'
    : 'https://us-central1-bff-rest-for-express.cloudfunctions.net/app'

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }, // honto
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      { 'http-equiv': 'Content-Style-Type', content: 'text/css' },
      {
        'http-equiv': 'x-xrds-location',
        content: 'https://honto.jp/honto.xrds'
      },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
    ],
    script: [
      { src: '~/assets/js/dnp/lib/jquery.js' },
      { src: '~/assets/js/dnp/honto/honto.js' },
      { src: '~/assets/js/dnp/honto/run.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '/css/font-awesome/css/all.css' },
      { rel: 'stylesheet', href: '/css/default.css' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/dnp/import.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/star-raing', mode: 'client' },
    { src: '~/plugins/firebase', mode: 'client' },
    { src: '~/plugins/localStorage', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    ['@nuxt/typescript-build', '@nuxtjs/eslint-module']
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
    // '@nuxtjs/proxy'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: { proxy: false, baseURL: URL },
  proxy: {
    '/api': URL
    // '/api': {
    //   target: URL,
    //   pathRewrite: {
    //     '^/api/': '/v1/'
    //   }
    // }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            propertyName: 'token'
          },
          logout: true
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
