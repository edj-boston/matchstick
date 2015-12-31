var ms = require('../lib/matchstick.js');


describe('#match()', function() {

    it('should perform accurate strict matches', function() {
        ms('/path', 'strict')
            .match('/path/')
            .should.be.false;
    });

    it('should perform accurate static matches', function() {
        ms('/path', 'static')
            .match('/path/')
            .should.be.true;
    });

    it('should perform accurate case-insensative static matches', function() {
        ms('/path', 'static', 'i')
            .match('/PATH')
            .should.be.true;
    });

    it('should perform accurate wildcard matches', function() {
        ms('/path/*/', 'wildcard')
            .match('/path/something/')
            .should.be.true;
    });

    it('should perform accurate template matches', function() {
        ms('/project/{pid}/task/{tid}', 'template')
            .match('/project/123/task/abc')
            .should.be.true;
    });

    it('should perform accurate regular expression matches', function() {
        ms('^\/path\/$', 'regexp')
            .match('/path/')
            .should.be.true;
    });

    it('should return false for a non-match on a symbolic type', function() {
        ms('/project/:pid/task/:tid', 'symbolic')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a template type', function() {
        ms('/project/{pid}/task/{tid}', 'template')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a strict type', function() {
        ms('/project/', 'strict')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a static type', function() {
        ms('/project', 'static')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a wildcard type', function() {
        ms('/project/*', 'wildcard')
            .match('/foo')
            .should.be.false;
    });

    it('should return flase for a non-match on a regexp type', function() {
        ms('^\/path\/$', 'regexp')
            .match('/foo')
            .should.be.false;
    });

});