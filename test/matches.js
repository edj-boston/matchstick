var ms = require('../lib/matchstick.js');


describe('#matches', function() {

    it('should produce accurate wildcard matches', function() {
        var wildcardPattern = ms('/project/*/task/*', 'wildcard');
        wildcardPattern.match('/project/123/task/abc');
        wildcardPattern.matches.should.eql(['123', 'abc']);
    });

    it('should produce accurate template matches', function() {
        var templatePattern = ms('/project/{pid}/task/{tid}', 'template');
        templatePattern.match('/project/123/task/abc');
        templatePattern.matches.should.eql({
            'pid' : '123',
            'tid' : 'abc'
        });
    });

    it('should produce accurate symbolic matches', function() {
        var symbolicPattern = ms('/project/:pid/task/:tid', 'symbolic');
        symbolicPattern.match('/project/123/task/abc');
        symbolicPattern.matches.should.eql({
            'pid' : '123',
            'tid' : 'abc'
        });
    });

    it('should produce accurate RegExp matches', function() {
        var regExpPattern = ms('^/project/(.*)/task/(.*)$', 'regexp');
        regExpPattern.match('/project/123/task/abc');
        regExpPattern.matches.should.eql(['123', 'abc']);
    });

});