const fs = require('fs-extra')
const i18n = require('i18next')
const isRenderer = require('is-electron-renderer')
const Backend = require('i18next-node-fs-backend')
const electron = require('electron')
const { dataPath, languages, fallbackLng } = require('./constants')

const localesPathBuiltin = `${__dirname}/locales`
const localesPathProd = `${dataPath}/locales`
let localesPath = `${dataPath}/locales`

if (process.env.NODE_ENV === 'development') {
  localesPath = localesPathBuiltin
  if (isRenderer) {
    localesPath = './app/locales'
  }
}

if (!fs.existsSync(localesPath)) {
  // TODO the third argument is not supposed to be a callbacl but options... the copy will likely fail.
  fs.copySync(localesPathBuiltin, localesPath, e => console.error(e))
}

const backendOptions = {
  // path where resources get loaded from
  loadPath: `${localesPath}/{{lng}}/{{ns}}.json`,

  // path to post missing resources
  addPath: `${localesPath}/{{lng}}/{{ns}}.missing.json`,

  // jsonIndent to use when storing json files
  jsonIndent: 2,
}


i18n
  .use(Backend)
  .init({
    lng: 'en',
    lngs: languages.map(ln => ln.value),
    fallbackLng,
    backend: backendOptions,
    saveMissing: true,
    saveMissingTo: 'all',
    // missingKeyHandler(lng, ns, key, fallbackValue) {
    //   // write missing key to all locales
    // },

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    // The logging is extremely verbose!
    // debug: process.env.NODE_ENV === 'development',
    interpolation: {
      // escapeValue: false // not needed for react!!
    },
  })

i18n.t = i18n.t.bind(i18n)
module.exports = i18n
