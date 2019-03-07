import os from 'os';
import logger from '../utils/logger';

const debug = process.argv.some(value => value.includes('--debug'))
const appName = 'bert'
// The os.homedir() method returns the home directory of the current user as a string.
const dataPath = `${os.homedir()}/.${appName}`
const userConfigFile = `${dataPath}/config.json5`

logger.log(`debug is ${debug}`);
logger.log(`dataPath is ${dataPath}`);
logger.log(`userConfigFile is ${userConfigFile}`);

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
