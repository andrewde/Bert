/**
 * use .js-item/.js-btn to operate dom and .item/.btn to change style,
 * this could make develop plugin which need custom_view more easier, like custom
 * button style(e.g. emoji plugin shows emoji icons in grid view)
 */
const { $, $$ } = require('../utils/dom-util.js');
const ipcRenderer = require('electron').ipcRenderer;
require('../../utils/notifier').initInRenderer();
const ui = require('./js/ui');
const shortcutMgr = require('./js/shortcutMgr');
import logger from '../../utils/logger';

const { resizeWindow } = ui;
// The keyup event is fired when a key is released.
const keyup = 'keyup';
const keydown = 'keydown';

let curItems = [];
let lastCmd = '';

function onExec(cmd) {
    logger.log('onExec', cmd);
    if (cmd !== lastCmd) {
        logger.log('sending exec with cmd', cmd);
        ipcRenderer.send('exec', { cmd });
        lastCmd = cmd;
    }
}
function onExecItem($select, cmd) {
    if (!$select) return;
    const $btn = $select.querySelector('.js-btn.select');
    const item = {
        value: curItems[+$select.getAttribute('data-index')].value,
        opt: $btn ? $btn.getAttribute('data-name') : null
    };
    ipcRenderer.send('exec-item', {
        cmd,
        item
    });
}

function onEnter($inp, cmd) {
    logger.log('onEnter, user pressed enter');
    if (cmd === lastCmd) {
        let $select = $('.js-item.select');
        if (!$select) {
            $select = $('.js-item');
        }
        onExecItem($select, cmd);
    } else {
        onExec(cmd);
    }
}

function bindInputKeyUp() {
    $('#search-input').addEventListener(keyup, e => {
        onExec(e.target.value);
    });
}

function bindDocKeyUp() {
    $.on(keyup, (e) => {
        logger.log('onEnter');
        const $inp = $('#search-input');
        const cmd = $inp.value;
        // TODO get rid of chinese characters all over the place
        if (e.altKey && e.keyCode >= 49 && e.keyCode <= 57) { // 输入数字
            const index = e.keyCode - 49;
            const $select = $$('.js-item')[index];
            onExecItem($select, cmd);
        } else {
            switch (e.keyCode) {
            case 13: // enter
                onEnter($inp, cmd);
                break;
            case 8: // backspace
                $('#search-input').focus();// auto jump to search input after pressed backspace
                break;
            default:
                break;
            }
        }
    });

    $.on(keydown, e => shortcutMgr.handleKeyDown(e));
}
// TODO: exec on click item
function bindItemClick() {
    $.on('click', (e) => {
        const item = e.closest('.js-item') || e.closest('.js-btn');
        logger.log('an item has been clicked', item);
    });
}

function bindIpcEvents() {
    ipcRenderer.on('exec-reply', (event, items) => {
        logger.log('received exec-reply');
        curItems = items;
        ui.renderItems(items);
        resizeWindow();
    });

    ipcRenderer.on('exec-item-reply', () => {
        $('#search-input').value = '';
        $('#items').innerHTML = '';
        resizeWindow();
        ipcRenderer.send('hide');
    });
}

function bindEvents() {
    bindInputKeyUp();
    bindItemClick();
    bindDocKeyUp();
    bindIpcEvents();
}

function init() {
    bindEvents();
}

init();
