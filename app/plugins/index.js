const path = require('path');
const config = require('../config');
import logger from '../utils/logger';

// TODO what are these commented lines?
// let lastUpdateTime = 0
// let lastExecTime = 0
// let isUpdateing = false
// let isExecing = false
let pluginMap;

// TODO what is that comment?
/*
node command: ELECTRON_RUN_AS_NODE=true `${process.execPath}`
 */

/**
 * Get plugin from Node's "require.cache" or load it up via "require" and initialize it.
 * https://nodejs.org/api/modules.html#modules_require_cache
 */
function getPlugin(pluginInfo) {
    logger.log(`getPlugin for plugin name ${pluginInfo.name}`);

    const pluginFile = path.normalize(pluginInfo.path);
    // Check if the plugin has been previously imported or not.
    // Once you call require(<module path>), the module is saved in require.cache.
    // Key = path, value = metadata about the module.
    const pluginIsRequiredBefore = !!require.cache[pluginFile];
    // Safe to call require multiple times for the same module/path.
    // Subsequent calls to require for the same module/path
    // will load the same object that was loaded by the first require.
    const plugin = require(pluginFile);

    logger.log(`pluginIsRequiredBefore ${pluginIsRequiredBefore}`);

    if (!pluginIsRequiredBefore) {
        try {
            logger.log(`Plugin '${pluginInfo.name}'
                        of path '${pluginInfo.path}' needs to be initialized.`);
            // init once
            if (plugin.init) {
                plugin.init(pluginInfo.config, config, config.context);
            }

            // setConfig was declared
            if (plugin.setConfig) {
                plugin.setConfig(pluginInfo.config, config, config.context);
            }
        } catch (e) {
            logger.error('Plugin [%s] setConfig failed!!', pluginInfo.name, e);
        }
    }
    return plugin;
}

function getMergedPluginInfo(pluginInf, cmdConf) {
    const cmdConfig = cmdConf || {};
    const pluginInfo = pluginInf;
    pluginInfo.config = pluginInfo.config || {};
    const platform = process.platform;
    const mergedCmdConfig = config.merge({},
        pluginInfo.config, pluginInfo.config[platform],
        cmdConfig, cmdConfig[platform]);

    const mergedPluginInfo = config.merge({}, pluginInfo, {
        config: mergedCmdConfig
    });

    return mergedPluginInfo;
}

function loadPluginMap() {
    logger.log('loading plugin map');
    pluginMap = {};
    Object.keys(config.plugins).forEach(pluginName => {
        logger.log(`loading plugin ${pluginName} and creating pluginInfo from its definition`);
        const pluginInfo = config.plugins[pluginName];
        pluginInfo.name = pluginName;
        const cmdConfigMap = pluginInfo.commands || { [pluginName]: {} };

        Object.keys(cmdConfigMap).forEach(cmd => {
            if (cmdConfigMap[cmd] && cmdConfigMap[cmd].enable === false) return;
            pluginMap[cmd] = getMergedPluginInfo(pluginInfo, cmdConfigMap[cmd]);
        });

        // init plugin on program start
        if (pluginInfo.config && pluginInfo.config.init_on_start) {
            const plugin = getPlugin(pluginInfo);
            try {
                if (plugin.initOnStart) {
                    plugin.initOnStart(pluginInfo.config, config);
                }
            } catch (e) {
                logger.error('Plugin [%s] initOnStart failed!', pluginName, e);
            }
        }
    });
    // logger.log(pluginMap);
}

// logger.log(pluginMap);
config.on('app-ready', loadPluginMap); // make config ready before set plugin config
config.on('reload-config', loadPluginMap);

function parseCmd(data) {
    logger.log(`Parsing cmd ${data.cmd}`);
    const args = data.cmd.split(' ');
    let key = 'app';
    // ("something" in {"a string":"", "something":"", "another string":""}) > yes
    if (args.length > 1 && (args[0] in pluginMap)) {
    // remove the first cell of array and return it
        key = args.shift();
        logger.log(`plucked key '${key}' from args`, key);
    } else {
        logger.log('plugin cannot be inferred from command, using default plugin from pluginMap');
        key = Object.keys(pluginMap).find(k => pluginMap[k].default);
    }
    const plugin = pluginMap[key];
    const result = {
        key,
        path: path.resolve(config.dataPath, plugin.path),
        args,
        type: data.type,
        plugin,
        config: plugin.config || {}
    };
    logger.log('cmd args', result.args);
    logger.log('cmd plugin type', result.type);
    logger.log('cmd plugin name', result.plugin.name);
    logger.log('cmd plugin path', result.plugin.path);

    return result;
}
module.exports = {
    exec: (data, event) => {
        const cmdInfo = parseCmd(data);
        const plugin = getPlugin(cmdInfo.plugin);
        try {
            logger.log('calling plugin');
            plugin.exec(cmdInfo.args, event, cmdInfo);
        } catch (e) {
            logger.error('Plugin [%s] exec failed!', cmdInfo.plugin.name, e);
        }
        // child.exec(`${cmdInfo.path} ${cmdInfo.args.join(' ')}`, (error, stdout, stderr)=>{
        //   if(error) logger.error(error);
        //   cb(stdout)
        // })
    },
    execItem(data, event) {
        const cmdInfo = parseCmd(data);
        const plugin = getPlugin(cmdInfo.plugin);
        try {
            plugin.execItem(data.item, event, cmdInfo);
        } catch (e) {
            logger.error('Plugin [%s] execItem failed!', cmdInfo.plugin.name, e);
        }
    }
};
