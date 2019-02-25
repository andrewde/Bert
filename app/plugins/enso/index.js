const electron = require('electron')
let shell = electron.shell
var querystring = require('querystring');
let pluginConfig
const fs = require('fs-extra')

module.exports = {
  setConfig: function (pConfig, globalConfig) {
    pluginConfig = pConfig
  },
  exec: function (args, event, cmdInfo) {
    // args = args.join(' ');

    console.log(`Enso plugin has received a command ${cmdInfo.key}`);
    console.log('Enso plugin has received some args', args);

    handleCommand(args, cmdInfo);

    // try to grab text selected outside of app

    // let engine = pluginConfig.engine?pluginConfig.engine:cmdInfo.key
    // event.sender.send('exec-reply', [{
    //   name: engine+' '+args,
    //   icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
    //   value: args,
    //   detail: ''
    // }])
  },
  execItem: function (item, event) {
    let urlPatt = pluginConfig.url || 'https://www.bing.com/search/?q=%s'
    shell.openExternal(urlPatt.replace('%s', querystring.escape(item.value)))
    event.sender.send('exec-item-reply')
  }
}

function handleCommand(args, cmdInfo) {
    switch(cmdInfo.key) {
        case 'learn':
        handleLearnCommand(args, cmdInfo);
          break;
        case 'open':
          // code block
          break;
        default:
          // code block
      }
}

function handleLearnCommand(args, cmdInfo) {
    let name = args[0];
    let preposition = args[1];
    let url = args[2];

    console.log('args', args);
    console.log(`url ${url}`);
    console.log(`name ${name}`);

    if (!url || !preposition || !name ){
        return;
    }

    let redirect = `
    <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>URL</key>
	<string>${url}</string>
</dict>
</plist>
    `;

    let filepath = `/Users/detiffe/.ELaunch/Learn/${name}.webloc`;

    console.log(`Writing file ${filepath}`);

    fs.writeFileSync(filepath, redirect, 'utf-8');
}