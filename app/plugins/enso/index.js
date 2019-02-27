import stringMatcher from './utils/stringMatcher';
import electron from 'electron';

const shell = electron.shell;
let pluginConfig;
const fs = require('fs-extra');
const os = require('os');
// On purpose not using constant file to keep this plugin standalone.
const dataPath = `${os.homedir()}/.berth/Enso`;
// TODO should be moved to JSON config of plugin as this is custom to MAC OS
// TODO what about windows and linux?!
const macOsShortcutExtension = 'webloc';
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

    // TODO should be moved to JSON config of plugin as this is custom to MAC OS
    const redirect = `
    <?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>URL</key>
	<string>${url}</string>
</dict>
</plist>
    `;

    const filepath = `${dataPath}/${name}.${macOsShortcutExtension}`;

    console.log(`Writing file ${filepath}`);

    // TODO if the directory does not exist it will just crash.
    //  Error: ENOENT: no such file or director
    fs.writeFileSync(filepath, redirect, 'utf-8');

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
                // TODO name should not include the file extension! only the name.
                name: filename,
                // TODO can we get the icon from the file itself?
                // icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
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
