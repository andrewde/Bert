import { expect } from 'chai';
import { setConfig, exec } from './index';
// TODO use import as below instead of require
// import * as fs from 'fs-extra'
const fs = require('fs-extra');
import * as sinon from 'sinon';

// TODO move to __test__ directory
describe('enso plugin', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        const pluginConfig = {
            // The platform has been mocked to 'testPlatform' in 'context-setup.js'
            testPlatform: {
                shortcutFile : {
                    template: 'Test content here: {{content}}',
                    placeholder: '{{content}}',
                    extension: '.url'
                },
            }
        };
        setConfig(pluginConfig);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('learn command', () => {
        it('should learn command and create file appropriately', () => {
            // TODO should not be my user directory, use the OS thing
            const expectedFilePath = '/Users/detiffe/.berth/Enso/test.url';
            const args = ['test', 'as', 'http://example.com'];
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

    describe('open command', () => {
        it('should open command', () => {
            // TODO mock files so that search can be conducted
            // TODO should not be my user directory, use the OS thing
            const args = ['testName', 'as', 'uuu'];
            const event = {
                sender: {
                    send: sinon.stub()
                }
            };
            const cmdInfo = {
                key: 'open',
                path: '',
                args: ['banana'],
                type: undefined,
                plugin:
                {
                    path: '',
                    commands: { learn: {}, open: {} },
                    name: 'e',
                    config: {}
                },
                config: {}
            };
            exec(args, event, cmdInfo);
            // expect(fs.existsSync(expectedFilePath)).to.be.true;
            // fs.unlink(expectedFilePath, () => {
            //     expect(fs.existsSync(expectedFilePath)).to.be.false;
            // });
        });
    });
});
