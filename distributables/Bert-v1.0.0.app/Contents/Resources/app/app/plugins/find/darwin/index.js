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
    setConfig(pConfig) {
        let plugin = require('./mdfind');
        switch (pConfig.type) {
        case 'locate':
            plugin = require('../linux/locate');
            break;
        case 'find':
            plugin = require('../linux/find');
            break;
        default:
        }
        plugin.setConfig && plugin.setConfig(pConfig);
        Object.assign(module.exports, plugin);
    },
    update(cb) {
    },
    exec(args, event) {
    },
    execItem(item, event) {
    }
};
