'use strict';

const ms = require('../lib/matchstick.js');


describe('ms()', () => {
    it('should throw an error for an unrecognized mode', () => {
        (function () {
            ms('pattern', 'made-up-mode');
        }).should.throw("[Matchstick] The 'mode' property must be one of strict, static, wildcard, template, symbolic, regexp");
    });

    it('should throw an error for a non-string pattern value', () => {
        (function () {
            ms([], 'strict');
        }).should.throw("[Matchstick] The 'pattern' property must be a string");
    });

    it('should throw an error for an invalid modifier character', () => {
        (function () {
            ms('pattern', 'static', 'x');
        }).should.throw("[Matchstick] Invalid modifier character 'x'");
    });

    it('should throw an error for a duplicate modifier character', () => {
        (function () {
            ms('pattern', 'static', 'gg');
        }).should.throw("[Matchstick] Duplicate modifier character 'g'");
    });
});
