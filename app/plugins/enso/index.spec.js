import { expect } from 'chai';
import { setConfig, exec } from './index';
import { appName } from '../../constants';
import * as sinon from 'sinon';
import * as fs from 'fs-extra';
import os from 'os';

// TODO move to __test__ directory
describe('enso plugin', () => {
    let sandbox;
    let basePath;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        basePath = `${os.tmpdir()}/${appName}/tests`;
        const mockPluginConfig = {
            // The platform has been mocked to 'testPlatform' in 'context-setup.js'
            testPlatform: {
                shortcutFile: {
                    template: 'Test content here: {{content}}',
                    placeholder: '{{content}}',
                    extension: '.url'
                },
                options: {
                    // Purposely use the tmp directory as opposed to use the user directory.
                    basepath: basePath,
                    filesToExclude: ['a_file_to_exclude']
                }
            }
        };
        setConfig(mockPluginConfig);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('learn command', () => {
        it('should learn command and create file appropriately', () => {
            const expectedFilePath = `${basePath}/test.url`;

            const args = ['test', 'as', 'http://example.com'];
            const event = {
                sender: {
                    send: sinon.stub()
                }
            };
            const cmdInfo = {
                key: 'learn',
                args: ['ppppp', 'as', 'y'],
                plugin:
                {
                    commands: { learn: {}, open: {} },
                    name: 'e',
                    config: {}
                },
                config: {}
            };
            exec(args, event, cmdInfo);
            // TODO on top of checking if file exists, check the content against an expected file.
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
