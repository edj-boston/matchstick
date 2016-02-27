'use strict';

const ms = require('../lib/matchstick.js');


describe('#matches', () => {
    it('should produce accurate wildcard matches', () => {
        const wildcardPattern = ms('/project/*/task/*', 'wildcard');
        wildcardPattern.match('/project/123/task/abc');
        wildcardPattern.matches.should.eql([ '123', 'abc' ]);
    });

    it('should produce accurate template matches', () => {
        const templatePattern = ms('/project/{pid}/task/{tid}', 'template');
        templatePattern.match('/project/123/task/abc');
        templatePattern.matches.should.eql({
            'pid' : '123',
            'tid' : 'abc'
        });
    });

    it('should produce accurate symbolic matches', () => {
        const symbolicPattern = ms('/project/:pid/task/:tid', 'symbolic');
        symbolicPattern.match('/project/123/task/abc');
        symbolicPattern.matches.should.eql({
            'pid' : '123',
            'tid' : 'abc'
        });
    });

    it('should produce accurate RegExp matches', () => {
        const regExpPattern = ms('^/project/(.*)/task/(.*)$', 'regexp');
        regExpPattern.match('/project/123/task/abc');
        regExpPattern.matches.should.eql([ '123', 'abc' ]);
    });
});
