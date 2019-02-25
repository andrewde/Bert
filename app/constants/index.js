const os = require('os')

const debug = process.argv.some(value => value.includes('--debug'))
const dataPath = `${os.homedir()}/.ELaunch`
const userConfigFile = `${dataPath}/config.json5`

module.exports = {
  debug,
  dataPath,
  userConfigFile,
  languages: [{
    // TODO clearly we don't want chinese right?
    // Fr could be useful though
    value: 'zh',
    label: '简体中文',
  }, {
    value: 'en',
    label: 'English',
  }],
  fallbackLng: 'en',
}
