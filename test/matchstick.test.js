// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the Redirect constructor
describe('Matchstick.test()', function() {

	describe('strict', function() {

	    it("should return false because 'path' matches '/path/path' globally", function() {
	    	assert.equal(false, matchstick('/path', 'strict').test('/path/'));
		});

	});

	describe('static', function() {

	    it("should return true because '/path' matches '/path' as a static match", function() {
	    	assert.equal(true, matchstick('/path', 'static').test('/path'));
		});

	});

	describe('wildcard', function() {

	    it("should return true because '/path/*/' matches '/path/something/' as a wildcard match", function() {
	    	assert.equal(true, matchstick('/path/*/', 'wildcard', 'i').test('/path/something/'));
		});

	});

	describe('regexp', function() {

	    it("should return true because '^\/path\/$' matches '/path/' as a regexp match", function() {
	    	assert.equal(true, matchstick('^\/path\/$', 'regexp').test('/path/'));
		});

	});

	describe('case insensitivity', function() {

	    it("should return true because '/path' matches '/PATH' as a case-insensitive static match", function() {
	    	assert.equal(true, matchstick('/path', 'static', 'i').test('/PATH'));
		});

	});

});