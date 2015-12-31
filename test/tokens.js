var ms = require('../lib/matchstick.js');


describe('#tokens', function() {

    it('should properly tokenize a template', function() {
        ms('/project/{pid}/task/{tid}', 'template').tokens
            .should.eql(['pid', 'tid']);
    });

    it('should properly tokenize symbols', function() {
        ms('/project/:pid/task/:tid', 'symbolic').tokens
            .should.eql(['pid', 'tid']);
    });

    it('should properly tokenize consequitive symbols', function() {
        ms('/:project:id', 'symbolic').tokens
            .should.eql(['project', 'id']);
    });

});