// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the Redirect constructor
describe('Matchstick', function() {

    it('should throw an error for an unrecognized mode', function() {
    	(function(){
			matchstick('pattern', 'made-up-mode');
		}).should.throw("[Matchstick] The 'mode' property must be one of static, wildcard, regex");
	});

    it('should throw an error for a non-string pattern value', function() {
    	(function(){
			matchstick([], 'strict');
		}).should.throw("[Matchstick] The 'pattern' property must be a string");
	});

    it('should throw an error for an invalid modifier character', function() {
    	(function(){
			matchstick('pattern', 'static', 'x');
		}).should.throw("[Matchstick] Invalid modifier character 'x'");
	});

    it('should throw an error for a duplicate modifier character', function() {
    	(function(){
			matchstick('pattern', 'static', 'gg');
		}).should.throw("[Matchstick] Invalid modifier character 'g'");
	});

});