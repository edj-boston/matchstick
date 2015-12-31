var ms = require('../lib/matchstick.js');


describe('#stick()', function() {

    it('should reconstruct a URL from a template and data', function() {
        ms('/project/{pid}/task/{tid}', 'template')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc');
    });

    it('should reconstruct a URL from a template and partial data', function() {
        ms('/project/{pid}/task/{tid}/action/{aid}', 'template')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc/action/');
    });

    it('should reconstruct a URL from symbols and data', function() {
        ms('/project/:pid/task/:tid', 'symbolic')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc');
    });

    it('should reconstruct a URL from symbols and partial data', function() {
        ms('/project/:pid/task/:tid/action/:aid', 'symbolic')
            .stick({
                pid : '123',
                tid : 'abc'
            })
            .should.equal('/project/123/task/abc/action/');
    });

});