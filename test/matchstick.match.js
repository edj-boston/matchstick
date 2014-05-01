// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the match() method
describe('matchstick.match(str)', function() {

	/* *
	 * Strict
	 */

	// Vanilla
	it("should return false because '/path' strictly matches '/path'", function() {
		assert.equal(matchstick('/path', 'strict').match('/path/'), false);
	});

	/* *
	 * Static (optional trailing slash)
	 */

	// Vanilla
	it("should return true because '/path' statically matches '/path/'", function() {
		assert.equal(matchstick('/path', 'static').match('/path/'), true);
	});

	// Case-insensitive
	it("should return true because '/path' matches '/PATH/' as a case-insensitive static match", function() {
		assert.equal(matchstick('/path', 'static', 'i').match('/PATH'), true);
	});

	/* *
	 * Wildcard
	 */

	// Vanilla
	it("should return true because the wildcard pattern '/path/*/' matches '/path/something/'", function() {
		assert.equal(matchstick('/path/*/', 'wildcard').match('/path/something/'), true);
	});

	/* *
	 * Template
	 */

	// Vanilla
	it("should return true because '/project/{pid}/task/{tid}' matches '/project/123/task/abc' as a template match", function() {
		assert.equal(matchstick('/project/{pid}/task/{tid}', 'template').match('/project/123/task/abc'), true);
	});

	/* *
	 * RegExp
	 */

	// Vanilla
	it("should return true because '^\/path\/$' matches '/path/' as a regexp match", function() {
		assert.equal(matchstick('^\/path\/$', 'regexp').match('/path/'), true);
	});

});