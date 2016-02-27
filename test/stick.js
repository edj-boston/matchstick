'use strict';

const ms = require('../lib/matchstick.js');


describe('#stick()', () => {
    it('should reconstruct a URL from a template and data', () => {
        ms('/project/{pid}/task/{tid}', 'template')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc');
    });

    it('should reconstruct a URL from a template and partial data', () => {
        ms('/project/{pid}/task/{tid}/action/{aid}', 'template')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc/action/');
    });

    it('should reconstruct a URL from symbols and data', () => {
        ms('/project/:pid/task/:tid', 'symbolic')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc');
    });

    it('should reconstruct a URL from symbols and partial data', () => {
        ms('/project/:pid/task/:tid/action/:aid', 'symbolic')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc/action/');
    });

    it('should throw an error for trying to perform replacement on a static pattern', () => {
        (() => {
            ms('/project/', 'static').stick({
                pid : '123',
                tid : 'abc'
            });
        }).should.throw("[Matchstick] Cannot call replace method on 'static' type");
    });

    it('should throw an error for trying to perform replacement on a static pattern', () => {
        (() => {
            ms('/project/', 'strict').stick({
                pid : '123',
                tid : 'abc'
            });
        }).should.throw("[Matchstick] Cannot call replace method on 'strict' type");
    });
});
