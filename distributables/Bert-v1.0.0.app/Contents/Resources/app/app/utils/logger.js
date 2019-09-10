import log from 'electron-log';

/** Logging facade.
 * Based on electron-log
 * https://www.npmjs.com/package/electron-log
*/
export default {
    log(text, ...params) {
        log.debug(text, params);
    },
    error(text, ...params) {
        log.error(text, params);
    }
};
