import { expect } from 'chai';
import { setConfig, exec } from './index';
// TODO use import as below instead of require
// import * as fs from 'fs-extra'
const fs = require('fs-extra');
import * as sinon from 'sinon';

// TODO move to __test__ directory
describe('index test', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const pluginConfig = {};
        const globalConfig = {};
        setConfig(pluginConfig, globalConfig);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('sayHello function', () => {
        it('should say Hello guys!', () => {
            // TODO should not be my user directory, use the OS thing
            const expectedFilePath = '/Users/detiffe/.berth/Enso/testName.webloc';
            const args = ['testName', 'as', 'uuu'];
            const event = {
                sender: {
                    send: sinon.stub()
                }
            };
            const cmdInfo = {
                key: 'learn',
                path: '/workspaces/Berthe/app/plugins/enso/index.js',
                args: ['ppppp', 'as', 'y'],
                type: undefined,
                plugin:
                {
                    path: '/workspaces/Berthe/app/config/../plugins/enso/index.js',
                    commands: { learn: {}, open: {} },
                    name: 'e',
                    config: {}
                },
                config: {}
            };
            exec(args, event, cmdInfo);
            expect(fs.existsSync(expectedFilePath)).to.be.true;
            fs.unlink(expectedFilePath, () => {
                expect(fs.existsSync(expectedFilePath)).to.be.false;
            });
        });
    });
});
