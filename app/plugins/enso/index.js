import stringMatcher from './utils/stringMatcher';
import electron from 'electron';
import os from 'os';

const shell = electron.shell;
let pluginConfig;
const fs = require('fs-extra');
// On purpose not using constant file to keep this plugin standalone.
const dataPath = `${os.homedir()}/.berth/Enso`;
const path = require('path');

function handleLearnCommand(args, event) {
    const name = args[0];
    const preposition = args[1];
    const url = args[2];

    console.log('args', args);
    console.log(`url ${url}`);
    console.log(`name ${name}`);

    if (!url || !preposition || !name) {
        return;
    }

    const platform = process.platform;
    console.log(`platform is ${platform}`);
    const shortcutFile = pluginConfig[platform].shortcutFile;
    const filepath = `${dataPath}/${name}${shortcutFile.extension}`;

    console.log(`Writing file ${filepath}`);

    // TODO if the directory does not exist it will just crash.
    //  Error: ENOENT: no such file or director
    // TODO Make sure  that the string returned by teplace is a new one
    // so that we do not edit the config itself!
    const fileContent = shortcutFile.template.replace(shortcutFile.placeholder, url);
    fs.writeFileSync(filepath, fileContent, 'utf-8');

    event.sender.send('exec-reply', [{
        // TODO should be localized
        name: `'${name}' saved.`,
        // TODO we can define the icon in the plugin config, may be eaier
        icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
        value: filepath,
        detail: ''
    }]);
}

function handleOpenCommand(args, event, cmdInfo) {
    const dir = fs.readdirSync(dataPath);

    console.log(`loading files from ${dataPath}`);

    if (!cmdInfo.args) {
        // TODO return a proper message? like no results?
        console.log('empty args, returning');
        return;
    }

    if (!dir) {
        // TODO create diretcory
        // TODO then return a proper message? like no results?
        console.log(`directory ${dataPath} does not exist, returning`);
        return;
    }

    const results = [];

    for (let i = 0, l = dir.length; i < l; i++) {
        const filePath = dir[i];
        const fileExtension = path.extname(filePath);
        const filename = path.basename(filePath, fileExtension);
        const isAMatch = stringMatcher.patternsMatchText(filePath, cmdInfo.args);
        // TODO in plugin config, add a list of files or extneions to be ignored.
        // e.g: .DS_STORE for mac os.
        if (isAMatch) {
            results.push({
                name: filename,
                // TODO can we get the icon from the file itself?
                // TODO if there is no icon provided, there is a cross displayed.
                icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
                value: `${dataPath}/${filePath}`
                // detail: ''
            });
        }
    }

    event.sender.send('exec-reply', results);
}

function handleCommand(args, event, cmdInfo) {
    switch (cmdInfo.key) {
    case 'learn':
        handleLearnCommand(args, event);
        break;
    case 'open':
        handleOpenCommand(args, event, cmdInfo);
        break;
    default:
          // code block
          // TODO handle this
    }
}

export const setConfig = (pConfig) => {
    pluginConfig = pConfig;
    console.log('plugin config set to ', pluginConfig);
};

export const exec = (args, event, cmdInfo) => {
    console.log(`Enso plugin has received a command ${cmdInfo.key}`);
    console.log('Enso plugin has received some args', args);
    handleCommand(args, event, cmdInfo);
};

export const execItem = (item, event) => {
    console.log('executing item', item);
    shell.openItem(item.value);
    event.sender.send('exec-item-reply');
};
