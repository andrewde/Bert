const electron = require('electron');
import logger from '../utils/logger';
import { enableLiveReload } from 'electron-compile';
// Electron's App instance allows to control your application's event lifecycle.
const { app, Tray, Menu, BrowserWindow } = electron;
const ipcMain = electron.ipcMain;
const plugin = require('../plugins');
const config = require('../config');
const path = require('path');
const { setPosition, setContentSize,
    hideMainWindow, toggleMainWindow } = require('./winMgr').init(config);
const shortcutMgr = require('./shortcutMgr');

let mainWindow;
let prefWindow;

function createMainWindow() {
    enableLiveReload();
    mainWindow = new BrowserWindow({
        width: config.width,
        height: config.maxHeight,
        resizable: config.debug,
        title: config.title,
        type: config.debug ? 'normal' : 'splash',
        frame: config.debug,
        skipTaskbar: !config.debug,
        autoHideMenuBar: !config.debug,
        backgroundColor: 'alpha(opacity=0)',
        show: config.debug,
        transparent: !config.debug,
        alwaysOnTop: !config.debug,
        disableAutoHideCursor: true
    });

    if (!config.debug) {
        setContentSize(mainWindow, config.width, config.height, false);
    }

    setPosition(mainWindow, {
        x: config.position && config.position.x,
        y: config.position && config.position.y,
        width: config.width,
        height: config.maxHeight
    });

    mainWindow.loadURL(`file://${__dirname}/../browser/search/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('blur', () => {
        if (!config.debug) {
            hideMainWindow();
        }
    });

    config.context.mainWindow = mainWindow;
}

/**
 * Create the preference window where user can tweak settings.
 */
function createPrefWindow() {
    prefWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        title: 'Bert Preferences',
        autoHideMenuBar: !config.debug,
        backgroundColor: 'alpha(opacity=0)'
    });
    if (config.debug) {
        const url = 'http://127.0.0.1:8080/';
        logger.log(`about to load preferences from '${url}'`);
        prefWindow.loadURL();
    } else {
        const url = `file://${__dirname}/../browser/pref/index.html`;
        logger.log(`about to load preferences from '${url}'`);
        prefWindow.loadURL(url);
    }
    setPosition(prefWindow);
}

let tray = null;

/**
 * Initialize the system tray icon and menu.
 */
function initTray() {
    // TODO replace icon
    tray = new Tray(path.normalize(`${__dirname}/../icon_16x16@2x.png`));
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Toggle Bert',
        click() {
            toggleMainWindow();
        }
    },
    {
        label: 'Exit',
        click() {
            app.quit();
        }
    }]);
    tray.setToolTip('Bert is running.');
    tray.setContextMenu(contextMenu);
}

function initMenu() { // init menu to fix copy/paste shortcut issue
    if (process.platform !== 'darwin' || Menu.getApplicationMenu()) return;
    const template = [{
        label: 'Edit',
        submenu: [{
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        }, {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    }];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function makeSingleInstance() {
    logger.log('in makeSingleInstance');

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        // This is not the first instance. Kill it.
        app.quit();
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            logger.log(`second-instance invoked with commandLine '${commandLine}'
                and workingDirectory '${workingDirectory}'`);
            // Someone tried to run a second instance.
            // We should focus our window for visibility.
            // This event handler will be called on the first instance.
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    logger.log('Main window minmimized, retoring it.');
                    mainWindow.restore();
                }
                logger.log('Main window not in focus, focusing.');
                mainWindow.focus();
            }
        });
    }
}

function init() {
    const shouldQuit = makeSingleInstance();
    if (shouldQuit) {
        logger.error('Only one instance is allowed to run at a time');
        app.quit();
        return;
    }
    if (!config.debug) {
        if (app.dock) {
            logger.log('app is docked, invoking hide');
            app.dock.hide();
        }
    }
    app.on('ready', () => {
        createMainWindow();
        shortcutMgr.registerAll();
        initTray();
        initMenu();

        if (config.debug) {
            createPrefWindow();
        }
        config.context.app = app;

        if (!config.language) {
            config.set('language', app.getLocale());
        }
        config.emit('app-ready');
    });
    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', () => {
        if (mainWindow === null) {
            createMainWindow();
        }
    });
    ipcMain.on('exec', (event, data) => {
        logger.log('Received exec event with data', data);
        plugin.exec(data, event);
    });
    ipcMain.on('exec-item', (event, data) => {
        plugin.execItem(data, event);
    });
    ipcMain.on('window-resize', (event, data) => {
        const dataHeight = data.height || mainWindow.getContentSize()[1];
        const height = Math.min(dataHeight, config.maxHeight);
        const width = data.width || config.width;
        if (!config.debug) {
            setContentSize(mainWindow, width, height);
        }
    });
    ipcMain.on('hide', () => {
        hideMainWindow();
    });
}

module.exports = { init };

// if (config.debug) {
//   const installer = require('electron-devtools-installer')
//   const installExtension = installer.default
//   const { REACT_DEVELOPER_TOOLS } = installer
//
//   installExtension(REACT_DEVELOPER_TOOLS)
//       .then((name) => logger.log(`Added Extension:  ${name}`))
//       .catch((err) => logger.log('An error occurred: ', err))
// }
