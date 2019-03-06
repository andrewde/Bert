import log from 'electron-log';

/** Logging facade.
 * Based on electron-log
 * https://www.npmjs.com/package/electron-log
*/
export default {
    log(text) {
        log.debug(text);
    },
    error(text) {
        log.error(text);
    }
};
