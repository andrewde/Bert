const shell = require('electron').shell;
const querystring = require('querystring');
let pluginConfig;

module.exports = {
    setConfig(pConfig, globalConfig) {
        pluginConfig = pConfig;
    },
    exec(args, event, cmdInfo) {
        args = args.join(' ');
        const engine = pluginConfig.engine ? pluginConfig.engine : cmdInfo.key;
        event.sender.send('exec-reply', [{
            name: `${engine} ${args}`,
            icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
            value: args,
            detail: ''
        }]);
    },
    execItem(item, event) {
        const urlPatt = pluginConfig.url || 'https://www.bing.com/search/?q=%s';
        shell.openExternal(urlPatt.replace('%s', querystring.escape(item.value)));
        event.sender.send('exec-item-reply');
    }
};
