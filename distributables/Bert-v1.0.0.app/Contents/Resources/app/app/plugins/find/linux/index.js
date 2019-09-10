var fs = require('fs');
const path = require('path');
var fs = require('fs-extra');
const child = require('child_process');
const config = require('../../../config');
const os = require('os');
const pluginConfig = {
    limit: 20
};
let findProcess;
module.exports = {
    setConfig(pConfig, gConfig) {
        let plugin = require('./find');
        switch (pConfig.type) {
        case 'locate':
            plugin = require('./locate');
            break;
        default:
        }
        plugin.setConfig && plugin.setConfig.call(plugin, ...arguments);
        Object.assign(module.exports, plugin);
    },
    update(cb) {
    },
    exec(args, event) {
    },
    execItem(item, event) {
    }
};
