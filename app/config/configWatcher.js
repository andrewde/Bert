const i18n = require('../i18n');
const dotDrop = require('dot-prop');
const { fallbackLng } = require('../constants');
const winMgr = require('../main/winMgr');
const autoLaunch = require('../main/autoLaunch');
import logger from '../utils/logger';

let config;
let rawConfig;

function setLanguage(ln, update = false) {
    logger.log('set language', ln);
    if (ln === i18n.language) return;
    i18n.changeLanguage(ln, err => {
        if (err && ln.includes('-')) {
            const ln2 = ln.match(/^([^-]+)-/)[1];
            setLanguage(ln2, true);
        }
        if (!update) return;
        if (err) {
            config.set('language', fallbackLng);
        } else {
            config.set('language', ln);
        }
    });
}

function syncOnSet(key, value) {
    dotDrop.set(rawConfig, key, value);
    switch (key) {
    case 'language':
        setLanguage(value);
        break;
    case 'display':
    case 'position':
    case 'position.x':
    case 'position.y':
        if (!config.isRenderer) {
            const mainWin = config.context.mainWindow;
            winMgr.setPosition(mainWin, rawConfig.position);
        }
        break;
    case 'width':
    case 'maxHeight':
        if (!config.isRenderer) {
            const mainWin = config.context.mainWindow;
            winMgr.setContentSize(mainWin, config.width, config.maxHeight);
        }
        break;
    case 'autoLaunch':
        if (!config.isRenderer) {
            autoLaunch(value);
        }
        break;
    default:
    }
}

function syncOnInit() {
    if (rawConfig.language) {
        setTimeout(() => { // waiting for react load to trigger event
            setLanguage(rawConfig.language);
        });
    }
    if (config.isFreshInstalled) {
        autoLaunch(rawConfig.autoLaunch);
    }
}

module.exports = {
    init(_config) {
        config = _config;
        winMgr.init(config);
        rawConfig = config.getRawConfig();
        // notify all process to change config
        config.on('set-config', syncOnSet);
        syncOnInit();
    }
};
