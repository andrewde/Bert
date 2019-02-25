import { expect } from "chai"
import { exec } from "./index"
// import * as sinon from 'sinon';

describe("index test", () => {
    let sandbox;

    beforeEach(() => {
        // sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        // sandbox.restore();
    });

    describe("sayHello function", () => {
        it("should say Hello guys!", () => {
            let args = [ 'xxx', 'as', 'uuu' ];
            let event = {};
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
            // expect(str).to.equal("Hello guys!")
        })
    })
})