var ms = require('../lib/matchstick.js');


describe('#regexp', function() {

    it('should produce an accurate regexp from a strict string', function() {
        ms('/path', 'strict').regexp.toString()
            .should.equal(new RegExp('^\\/path$').toString());
    });

    it('should produce an accurate regexp from a static string', function() {
        ms('/path', 'static').regexp.toString()
            .should.equal(new RegExp('^\\/path(\/?)$').toString());
    });

    it('should produce an accurate regexp from a wildcard string', function() {
        ms('/path/*/', 'wildcard').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)\\/$').toString());
    });

    it('should produce an accurate regexp from a  string', function() {
        ms('/path/{id}', 'template').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)$').toString());
    });

    it('should produce an accurate regexp from symbols', function() {
        ms('/path/:id', 'symbolic').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)$').toString());
    });

    it('should produce an exact regexp', function() {
        ms('/path', 'regexp').regexp.toString()
            .should.equal(new RegExp('/path').toString());
    });

});