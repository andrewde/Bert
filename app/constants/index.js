import os from 'os';
const appName = 'bert'
const debug = process.argv.some(value => value.includes('--debug'))
const dataPath = `${os.homedir()}/.${appName}`
const userConfigFile = `${dataPath}/config.json5`

console.log(`debug is ${debug}`);
console.log(`dataPath is ${dataPath}`);
console.log(`userConfigFile is ${userConfigFile}`);

module.exports = {
  debug,
  appName,
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
