const environment = process.env.NODE_ENV || 'development'
const URL =
  environment === 'local'
    ? 'http://localhost:3000'
    : 'https://us-central1-bff-rest-for-express.cloudfunctions.net/app'

export default {
  mode: 'universal',

  // <!--[if lt IE 9]>
  //   <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  // <![endif]-->

  // <meta http-equiv="Content-Script-Type" content="text/javascript" />
  // <meta
  //   name="keywords"
  //   content="ワールドトリガー 1,葦原大介（著者）,漫画・コミック,電子書籍ストア,honto"
  // />
  // <meta
  //   name="description"
  //   content="ワールドトリガー 1/葦原大介（著者）（漫画・コミック） - 異次元からの侵略者「近界民」の脅威にさらされている三門市。そこに住む少し正義感の強い中学生・三雲修は、謎の転校生・空閑遊真と出会う。遊真の行...電子書籍のダウンロードはhontoで。"
  // />
  // <title>
  //   ワールドトリガー 1（漫画）の電子書籍 -
  //   無料・試し読みも！honto電子書籍ストア
  // </title>

  // <script async="" charset="utf-8" src="./_files/pixel_p"></script>
  // <script async="" charset="utf-8" src="./_files/pixel_p(1)"></script>
  // <script async="" charset="utf-8" src="./_files/pixel_p(2)"></script>
  // <script async="" charset="utf-8" src="./_files/pixel"></script>
  // <script charset="utf-8" async="" src="./_files/pixel2_asr.js"></script>
  // <script async="" charset="utf-8" src="./_files/pixel_p(3)"></script>

  // <script src="./_files/907035796134010" async=""></script>
  // <script src="./_files/1591564717559476" async=""></script>
  // <script async="" src="./_files/fbevents.js"></script>

  // <script async="" src="./_files/saved_resource"></script>
  // <script
  //   type="text/javascript"
  //   async=""
  //   src="./_files/analytics.js"
  // ></script>
  // <script async="" charset="utf-8" src="./_files/rta"></script>
  // <script charset="utf-8" async="" src="./_files/tt_pixel2_asr.js"></script>
  // <script type="text/javascript" async="" src="./_files/js"></script>
  // <script async="" src="./_files/uwt.js"></script>
  // <script
  //   charset="utf-8"
  //   async=""
  //   src="./_files/pixel2_asr_p_delay.js"
  // ></script>
  // <script type="text/javascript" async="" src="./_files/f.txt"></script>
  // <script
  //   type="text/javascript"
  //   charset="UTF-8"
  //   async=""
  //   src="./_files/x.js"
  // ></script>
  // <script async="" src="./_files/gtm.js"></script>

  // <meta http-equiv="x-dns-prefetch-control" content="on" />
  // <link rel="dns-prefetch" href="https://image.honto.jp/" />
  // <link rel="dns-prefetch" href="https://dnp.d2.sc.omtrdc.net/" />
  // <link rel="dns-prefetch" href="https://ping.honto.thatsping.com/" />
  // <link rel="dns-prefetch" href="https://b92.yahoo.co.jp/" />
  // <link rel="dns-prefetch" href="https://b97.yahoo.co.jp/" />
  // <link rel="dns-prefetch" href="https://cd.ladsp.com/" />
  // <link rel="dns-prefetch" href="https://connect.facebook.net/" />
  // <link rel="dns-prefetch" href="https://d.line-scdn.net/" />
  // <link rel="dns-prefetch" href="https://dex00.deqwas.net/" />
  // <link rel="dns-prefetch" href="https://fspark-ap.com/" />
  // <link rel="dns-prefetch" href="https://genieedmp.com/" />
  // <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net/" />
  // <link rel="dns-prefetch" href="https://js.fout.jp/" />
  // <link rel="dns-prefetch" href="https://px.ladsp.com/" />
  // <link rel="dns-prefetch" href="https://rt.gsspat.jp/" />
  // <link rel="dns-prefetch" href="https://s.yimg.jp/" />
  // <link rel="dns-prefetch" href="https://static.ads-twitter.com/" />
  // <link rel="dns-prefetch" href="https://statics.a8.net/" />
  // <link rel="dns-prefetch" href="https://tr.line.me/" />
  // <link rel="dns-prefetch" href="https://trj.valuecommerce.com/" />
  // <link rel="dns-prefetch" href="https://www.facebook.com/" />
  // <link rel="dns-prefetch" href="https://tt.ladsp.com/" />
  // <link rel="dns-prefetch" href="https://www.googleadservices.com/" />
  // <link rel="dns-prefetch" href="https://www.google-analytics.com/" />
  // <link rel="dns-prefetch" href="https://www.googletagmanager.com/" />
  // <link rel="dns-prefetch" href="https://www.gstatic.com/" />

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
      { src: '~/assets/js/dnp/jquery.js' },
      { src: '~/assets/js/dnp/honto.js' },
      { src: '~/assets/js/dnp/run.js' }
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
