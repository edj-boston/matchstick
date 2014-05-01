// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the Redirect constructor
describe('Matchstick', function() {

	/* *
	 * Validation
	 */

	it('should throw an error for an unrecognized mode', function() {
		(function(){
			matchstick('pattern', 'made-up-mode');
		}).should.throw("[Matchstick] The 'mode' property must be one of strict, static, wildcard, template, colon, regexp");
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


	/* *
	 * RegExp property
	 */

	// Strict
	it("should return a regexp equivalent to '^\/path$' for the strict pattern string '/path'", function() {
		assert.equal(matchstick('/path', 'strict').regexp.toString(), new RegExp('^\\/path$').toString());
	});

	// Static (optional trailing slash)
	it("should return a regexp equivalent to '^\/path(/?)$' for the static pattern string '/path'", function() {
		assert.equal(matchstick('/path', 'static').regexp.toString(), new RegExp('^\\/path(\/?)$').toString());
	});

	// Wildcard
	it("should return a regexp equivalent to '^\/path\/(.*)\/$' for the wildcard pattern '/path/*/'", function() {
		assert.equal(matchstick('/path/*/', 'wildcard').regexp.toString(), new RegExp('^\\/path\\/(.*)\\/$').toString());
	});

	// Template
	it("should return a regexp equivalent to '^\/path\/(.*)$' for the template pattern '/path/{id}'", function() {
		assert.equal(matchstick('/path/{id}', 'template').regexp.toString(), new RegExp('^\\/path\\/(.*)$').toString());
	});

	// Colon
	it("should return a regexp equivalent to '^\/path\/(.*)$' for the colon pattern '/path/:id'", function() {
		assert.equal(matchstick('/path/:id', 'colon').regexp.toString(), new RegExp('^\\/path\\/(.*)$').toString());
	});

	// RegExp
	it("should return a regexp equivalent to '/path' for the regex string '/path'", function() {
		assert.equal(matchstick('/path', 'regexp').regexp.toString(), new RegExp('/path').toString());
	});


	/* *
	 * Tokens property
	 */

	// Template
	it("should return a token array [ 'pid', 'tid' ] for the template pattern '/project/{pid}/task/{tid}'", function() {
		assert.deepEqual(matchstick('/project/{pid}/task/{tid}', 'template').tokens, ['pid', 'tid']);
	});

	// Colon
	it("should return a token array [ 'pid', 'tid' ] for the colon pattern '/project/:pid/task/:tid'", function() {
		assert.deepEqual(matchstick('/project/:pid/task/:tid', 'colon').tokens, ['pid', 'tid']);
	});


});