import stringMatcher from './utils/stringMatcher';
import electron from 'electron';
import logger from '../../utils/logger';
import * as fs from 'fs-extra';
const path = require('path');

let pluginConfig;
let pluginPlatformConfig;
let basePath;
const shell = electron.shell;

function loadFilesMatchingKeywords(keywords, directory) {
    const results = [];
    // loop through each file in the directory
    for (let i = 0, l = directory.length; i < l; i++) {
        const filePath = directory[i];
        const fileExtension = path.extname(filePath);
        const filename = path.basename(filePath, fileExtension);
        const filesToExclude = pluginPlatformConfig.options.filesToExclude;
        const shouldBeExcluded = filesToExclude.indexOf(filename) !== -1;
        const isAMatch = !!shouldBeExcluded
                            || stringMatcher.patternsMatchText(filePath, keywords);

        if (shouldBeExcluded) {
            logger.log(`file '${filename}' has been excluded from results`);
            continue;
        }
        // TODO in plugin config, add a list of files or extneions to be ignored.
        // e.g: .DS_STORE for mac os.
        if (isAMatch) {
            results.push({
                name: filename,
                // TODO can we get the icon from the file itself?
                // TODO if there is no icon provided, there is a cross displayed.
                icon: pluginConfig.icon || `${__dirname}/assets/search.svg`,
                value: `${basePath}/${filePath}`
                // TODO what is detail for?
                // detail: ''
            });
        }
    }
    return results;
}

function getOrCreateWorkingDirectory() {
    logger.log(`getOrCreateWorkingDirectory from ${basePath}`);
    if (!fs.existsSync(basePath)) {
        logger.log(`directory ${basePath} does not exist, creating it`);
        // create the full directory path if it doesn't exist (like mkdir -p)
        fs.ensureDirSync(basePath);
    }
    const directory = fs.readdirSync(basePath);
    return directory;
}

function returnAllFilesMatchingSearch(args, event) {
    if (!args) {
        // TODO return a proper message? like no results?
        logger.log('empty args, skipping.');
        return;
    }
    const results = loadFilesMatchingKeywords(args, getOrCreateWorkingDirectory());
    event.sender.send('exec-reply', results);
}

function handleLearnCommand(args, event) {
    returnAllFilesMatchingSearch(args, event);

    const name = args[0];
    const preposition = args[1];
    const url = args[2];

    logger.log('args', args);
    logger.log(`url ${url}`);
    logger.log(`name ${name}`);

    if (!url || !preposition || !name) {
        return;
    }

    const shortcutFile = pluginPlatformConfig.shortcutFile;
    const filepath = `${basePath}/${name}${shortcutFile.extension}`;

    logger.log(`Writing file ${filepath}`);

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

function handleCommand(args, event, cmdInfo) {
    switch (cmdInfo.key) {
        case 'learn':
            handleLearnCommand(args, event);
            break;
        case 'open':
            returnAllFilesMatchingSearch(args, event);
            break;
        default:
            logger.error(`command '${cmdInfo.key}' was received but cannot be handled`);
    }
}

// TODO consolidate export like done in logger

export const setConfig = (pConfig) => {
    pluginConfig = pConfig;
    pluginPlatformConfig = pluginConfig[process.platform];
    basePath = pluginPlatformConfig.options.basepath;
    logger.log('plugin config set to ', pluginConfig);
    getOrCreateWorkingDirectory();
};

export const exec = (args, event, cmdInfo) => {
    logger.log(`Enso plugin has received a command ${cmdInfo.key}`);
    logger.log('Enso plugin has received some args', args);
    handleCommand(args, event, cmdInfo);
};

export const execItem = (item, event) => {
    logger.log('executing item', item);
    shell.openItem(item.value);
    event.sender.send('exec-item-reply');
};
