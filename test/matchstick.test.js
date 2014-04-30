// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the Redirect constructor
describe('Matchstick.test()', function() {

	/* *
	 * Strict
	 */

	// Vanilla
	it("should return false because '/path' strictly matches '/path'", function() {
		assert.equal(false, matchstick('/path', 'strict').test('/path/'));
	});

	/* *
	 * Static (optional trailing slash)
	 */

	// Vanilla
	it("should return true because '/path' statically matches '/path/'", function() {
		assert.equal(true, matchstick('/path', 'static').test('/path/'));
	});

	// Case-insensitive
	it("should return true because '/path' matches '/PATH/' as a case-insensitive static match", function() {
		assert.equal(true, matchstick('/path', 'static', 'i').test('/PATH'));
	});

	/* *
	 * Wildcard
	 */

	// Vanilla
	it("should return true because the wildcard pattern '/path/*/' matches '/path/something/'", function() {
		assert.equal(true, matchstick('/path/*/', 'wildcard').test('/path/something/'));
	});

	/* *
	 * Template
	 */

	// Vanilla
	it("should return true because '/project/{pid}/task/{tid}' matches '/project/123/task/abc' as a template match", function() {
		assert.equal(true, matchstick('/project/{pid}/task/{tid}', 'template').test('/project/123/task/abc'));
	});

	/* *
	 * RegExp
	 */

	// Vanilla
	it("should return true because '^\/path\/$' matches '/path/' as a regexp match", function() {
		assert.equal(true, matchstick('^\/path\/$', 'regexp').test('/path/'));
	});

});