/**
 * Mock Node's platform so that you don't have to configure the tests per platform.
 * e.g: your MAC (darwin), limux, windows, etc.
 */
Object.defineProperty(process, 'platform', {
    value: 'testPlatform',
    writable: false,
    enumerable: true,
    configurable: true
});