import { expect } from 'chai';
import { setConfig, exec } from '../index';
import { appName } from '../../../constants';
import * as sinon from 'sinon';
import * as fs from 'fs-extra';
import os from 'os';
import logger from '../../../utils/logger';

const pluginBasePath = `${os.tmpdir()}/${appName}/tests`;
const testArtifacsPath = `${__dirname}/artifacts/shortcuts`;

const assertOpenCommandResult = (result, expectedName, expectedIconName) => {
    expect(result.name).to.equal(expectedName);
    expect(result.icon).to.contains(`/assets/${expectedIconName}`);
    expect(result.value).to.equal(`${pluginBasePath}/${expectedName}.url`);
};

/**
 * TODO add a test that make sure the diretcory is created if doesn't exist
 * TODO running tests into a different directory each time should do it
 * TODO for learn on top of checking if file exists, check the content against an expected file.
*/
describe('enso plugin', () => {
    beforeEach(() => {
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
                    basepath: pluginBasePath,
                    filesToExclude: ['a_file_to_exclude']
                }
            }
        };

        setConfig(mockPluginConfig);

        // copy tests artifcats
        logger.log(`Copying test artifacts from '${testArtifacsPath}' to '${pluginBasePath}'`);
        fs.copySync(testArtifacsPath, pluginBasePath);
    });

    afterEach(() => {
        // clean any files that may have been created to start next from a clean state
        fs.emptyDirSync(pluginBasePath);
    });

    describe('learn command', () => {
        it('should learn command and create file appropriately', () => {
            // arrange
            const args = ['test', 'as', 'http://test.com'];
            const event = {
                sender: {
                    send: sinon.stub()
                }
            };
            const cmdInfo = {
                key: 'learn'
            };

            // act
            exec(args, event, cmdInfo);

            // assert
            const expectedFilePath = `${pluginBasePath}/test.url`;
            expect(fs.existsSync(expectedFilePath)).to.be.true;
            const actualFileContent = fs.readFileSync(expectedFilePath, 'utf8');
            expect(actualFileContent).to.equal('Test content here: http://test.com');
        });
    });

    describe('open command', () => {
        it('should return all the resutls matching the text input', () => {
            // arrange
            const args = ['test'];
            const event = {
                sender: {
                    send: sinon.stub()
                }
            };
            const cmdInfo = {
                key: 'open'
            };

            // act
            exec(args, event, cmdInfo);

            // assert
            sinon.assert.calledOnce(event.sender.send);

            const actualArguments = event.sender.send.getCall(0).args;
            const eventNameArgument = actualArguments[0];
            const resultsArgument = actualArguments[1];

            expect(eventNameArgument).to.equal('exec-reply');

            assertOpenCommandResult(resultsArgument[0], 'test-1', 'search.svg');
            assertOpenCommandResult(resultsArgument[1], 'test-2', 'search.svg');
            assertOpenCommandResult(resultsArgument[2], 'test-3', 'search.svg');
        });
    });
});
