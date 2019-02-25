const fs = require('fs');
let path = require('path');
const os = require('os');
const child = require('child_process')
const config = require('../config')

// let lastUpdateTime = 0
// let lastExecTime = 0
// let isUpdateing = false
// let isExecing = false
let pluginMap

/*
node command: ELECTRON_RUN_AS_NODE=true `${process.execPath}`
 */

function getPlugin(pluginInfo) {
  console.log(`getPlugin for plugin name ${pluginInfo.name}`);

  const pluginFile = path.normalize(pluginInfo.path)
  const pluginIsRequiredBefore = !!require.cache[pluginFile]
  const plugin = require(pluginFile)

  if (!pluginIsRequiredBefore) {
    try {
      // init once
      plugin.init && plugin.init(pluginInfo.config, config, config.context)
      // setConfig was declared
      plugin.setConfig && plugin.setConfig(pluginInfo.config, config, config.context)
    } catch (e) {
      console.error('Plugin [%s] setConfig failed!!', pluginInfo.name, e)
    }
  }
  return plugin
}

function getMergedPluginInfo(pluginInfo, cmdConfig) {
  cmdConfig = cmdConfig || {}
  pluginInfo.config = pluginInfo.config || {}
  const platform = process.platform
  const mergedCmdConfig = config.merge({},
    pluginInfo.config, pluginInfo.config[platform],
    cmdConfig, cmdConfig[platform])

  // console.log(mergedCmdConfig);
  const mergedPluginInfo = config.merge({}, pluginInfo, {
    config: mergedCmdConfig
  })

  return mergedPluginInfo
}

function loadPluginMap() {
  console.log('loading plugin map');
  pluginMap = {}
  Object.keys(config.plugins).forEach(pluginName => {
    console.log(`loading plugin ${pluginName} and creating pluginInfo from its definition`);
    const pluginInfo = config.plugins[pluginName]
    pluginInfo.name = pluginName
    const cmdConfigMap = pluginInfo.commands || { [pluginName]: {} }

    Object.keys(cmdConfigMap).forEach(cmd => {
      if(cmdConfigMap[cmd] && cmdConfigMap[cmd].enable === false) return
      pluginMap[cmd] = getMergedPluginInfo(pluginInfo, cmdConfigMap[cmd])
    })

    // init plugin on program start
    if(pluginInfo.config && pluginInfo.config.init_on_start) {
      const plugin = getPlugin(pluginInfo)
      try {
        plugin.initOnStart && plugin.initOnStart(pluginInfo.config, config)
      } catch (e) {
        console.error('Plugin [%s] initOnStart failed!', pluginName, e)
      }
    }
  })
    // console.log(pluginMap);
}

// console.log(pluginMap);
config.on('app-ready', loadPluginMap) // make config ready before set plugin config
config.on('reload-config', loadPluginMap)

function parseCmd(data) {
  console.log(`Parsing cmd ${data.cmd}`);
  const args = data.cmd.split(' ')
  let key = 'app'
  // ("something" in {"a string":"", "something":"", "another string":""}) > yes
  if (args.length > 1 && (args[0] in pluginMap)) {
    // remove the first cell of array and return it
    key = args.shift()
    console.log(`plucked key '${key}' from args`, key);
  } else {
    console.log('plugin cannot be inferred from command, using default plugin from pluginMap');
    key = Object.keys(pluginMap).find(k => pluginMap[k].default)
  }
  const plugin = pluginMap[key]
  let result = {
    key: key,
    path: path.resolve(config.dataPath, plugin.path),
    args: args,
    type: data.type,
    plugin: plugin,
    config: plugin.config || {}
  }
  console.log('cmd args', result.args);
  console.log('cmd plugin type', result.type);
  console.log('cmd plugin name', result.plugin.name);
  console.log('cmd plugin path', result.plugin.path);

  return result;
}
module.exports = {
  exec: (data, event) => {
    const cmdInfo = parseCmd(data)
    const plugin = getPlugin(cmdInfo.plugin)
    try {
      console.log('calling plugin');
      plugin.exec(cmdInfo.args, event, cmdInfo)
    } catch (e) {
      console.error('Plugin [%s] exec failed!', cmdInfo.plugin.name, e)
    }
      // child.exec(`${cmdInfo.path} ${cmdInfo.args.join(' ')}`, (error, stdout, stderr)=>{
      //   if(error) console.error(error);
      //   cb(stdout)
      // })
  },
  execItem: function (data, event) {
    const cmdInfo = parseCmd(data)
    const plugin = getPlugin(cmdInfo.plugin)
    try {
      plugin.execItem(data.item, event, cmdInfo)
    } catch (e) {
      console.error('Plugin [%s] execItem failed!', cmdInfo.plugin.name, e)
    }
  }
}
