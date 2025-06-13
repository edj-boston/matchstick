'use strict';

const ms = require('../lib/matchstick.js');


describe('#regexp', () => {
    it('should produce an accurate regexp from a strict string', () => {
        ms('/path', 'strict').regexp.toString()
            .should.equal(new RegExp('^\\/path$').toString());
    });

    it('should produce an accurate regexp from a static string', () => {
        ms('/path', 'static').regexp.toString()
            .should.equal(new RegExp('^\\/path(\/?)$').toString());
    });

    it('should produce an accurate regexp from a wildcard string', () => {
        ms('/path/*/', 'wildcard').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)\\/$').toString());
    });

    it('should produce an accurate regexp from a template string', () => {
        ms('/path/{id}', 'template').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)$').toString());
    });

    it('should produce an accurate regexp from symbols', () => {
        ms('/path/:id', 'symbolic').regexp.toString()
            .should.equal(new RegExp('^\\/path\\/(.*)$').toString());
    });

    it('should produce an exact regexp', () => {
        ms('/path', 'regexp').regexp.toString()
            .should.equal(new RegExp('/path').toString());
    });
});
