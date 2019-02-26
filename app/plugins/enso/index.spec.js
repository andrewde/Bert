import { expect } from "chai"
import { setConfig, exec } from "./index"
// import { fs } from 'fs-extra'
var fs = require('fs-extra')
import * as sinon from 'sinon';

describe("index test", () => {
    let sandbox;

    beforeEach(() => {
        // sandbox = sinon.sandbox.create();
        let pluginConfig = {};
        let globalConfig = {};
        setConfig(pluginConfig, globalConfig)
    });

    afterEach(() => {
        // sandbox.restore();
    });

    describe("sayHello function", () => {
        it("should say Hello guys!", () => {
            // TODO should not be my user directory
            let expectedFilePath = `/Users/detiffe/.berth/Enso/testName.webloc`;
            let args = [ 'testName', 'as', 'uuu' ];
            let event = {
                sender : {
                    send : sinon.stub()
                }
            };
            let cmdInfo = { key: 'learn',
            path: '/workspaces/Berthe/app/plugins/enso/index.js',
            args: [ 'ppppp', 'as', 'y' ],
            type: undefined,
            plugin:
             { path: '/workspaces/Berthe/app/config/../plugins/enso/index.js',
               commands: { learn: {}, open: {} },
               name: 'e',
               config: {} },
            config: {} };
            exec(args, event, cmdInfo);
            expect(fs.existsSync(expectedFilePath)).to.be.true;
            fs.unlink(expectedFilePath, () => {
                console.log('in callback');
                expect(fs.existsSync(expectedFilePath)).to.be.false;
            });
        })
    })
})