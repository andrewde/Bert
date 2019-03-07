const isRenderer = require('is-electron-renderer');
const ElectronBus = require('./ElectronBus');
import logger from '../utils/logger';

const notifierBus = new ElectronBus('notifier');

function notify(title, options) {
    return new Notification(title, options || { body: title });
}


module.exports = {
    initInRenderer() {
        notifierBus.on('notify', (title, options) => {
            logger.log('notify', title, options);
            notify.call(this, title, options);
        });
        return this;
    },
    notify(title, options) {
        if (isRenderer) { // in renderer process
            notify(title, options);
        } else {
            notifierBus.emit('notify', ...arguments);
        }
    }
};
