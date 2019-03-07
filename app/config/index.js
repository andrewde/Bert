import * as fs from 'fs-extra';
const JSON5 = require('json5');
const isRenderer = require('is-electron-renderer');
const dotDrop = require('dot-prop');
const { merge } = require('../utils/merge');
const ElectronBus = require('../utils/ElectronBus');
const notifier = require('../utils/notifier');
const defaultConfig = require('./config.default.js');
const configWatcher = require('./configWatcher');
const i18n = require('../i18n');
const { debug, dataPath, userConfigFile } = require('../constants');
import logger from '../utils/logger';

let config = new ElectronBus('config');

let rawConfig = {};

let isFreshInstalled = false;

// A frozen object can no longer be changed.
Object.freeze(defaultConfig);

function writeConfig() {
    fs.outputFileSync(userConfigFile, JSON5.stringify(rawConfig, null, 2), 'utf8');
}

function writeDefaultConfig() {
    try {
        rawConfig = merge({}, defaultConfig);
        writeConfig();
    } catch (err) {
        logger.error(err);
    }
}

function loadConfig() {
    logger.log(`loading config file ${userConfigFile}`);
    const exist = fs.existsSync(userConfigFile);
    if (!exist) {
        logger.log('fresh install');
        writeDefaultConfig();
        isFreshInstalled = true;
    } else {
        logger.log('user config file exists, loading it');
        const userConfigStr = fs.readFileSync(userConfigFile, 'utf8');
        if (userConfigStr.trim().startsWith('module.exports')) {
            writeDefaultConfig();
        } else {
            logger.log('merging default config and user config');
            rawConfig = merge({}, defaultConfig, JSON5.parse(userConfigStr));
        }
    }
    return this;
}

Object.assign(config, {
    dataPath,
    userConfigFile,
    debug,
    isRenderer,
    merge,
    isFreshInstalled,
    getRawConfig() {
        return rawConfig;
    },
    getDefaultConfig() {
        return defaultConfig;
    },
    getCopyedConfig() {
        return merge({}, rawConfig);
    },
    get(key, defaultValue) {
        return dotDrop.get(rawConfig, key, defaultValue);
    },
    write(key, value) {
        dotDrop.set(rawConfig, key, value);
        writeConfig();
    },
    set(key, value) { // write with emit event
        const originalVal = this.get(key);
        try {
            this.write(key, value);
            // notify all process to change config
            config.emit('set-config', key, value);
            return true;
        } catch (e) {
            dotDrop.set(rawConfig, key, originalVal);
            logger.error(e);
            return false;
        }
    },
    context: {
        mainWindow: null,
        notifier,
        i18n
    }
});

loadConfig();


config = new Proxy(config, {
    get(target, name) {
        return name in target
            ? target[name]
            : rawConfig[name];
    }
});

configWatcher.init(config);

module.exports = config;
