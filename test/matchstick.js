// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the Redirect constructor
describe('matchstick(pattern, mode, modifiers)', function() {

	/* *
	 * Validation
	 */

	it('should throw an error for an unrecognized mode', function() {
		(function(){
			matchstick('pattern', 'made-up-mode');
		}).should.throw("[Matchstick] The 'mode' property must be one of strict, static, wildcard, template, symbolic, regexp");
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
	it("should return a regexp equivalent to '^\/path\/(.*)$' for the symbolic pattern '/path/:id'", function() {
		assert.equal(matchstick('/path/:id', 'symbolic').regexp.toString(), new RegExp('^\\/path\\/(.*)$').toString());
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
	it("should return a token array [ 'pid', 'tid' ] for the symbolic pattern '/project/:pid/task/:tid'", function() {
		assert.deepEqual(matchstick('/project/:pid/task/:tid', 'symbolic').tokens, ['pid', 'tid']);
	});

	// Colon
	it("should return a token array [ 'project', 'id' ] for the symbolic pattern '/:project:id'", function() {
		assert.deepEqual(matchstick('/:project:id', 'symbolic').tokens, ['project', 'id']);
	});


	/* *
	 * Matches property
	 */

	// Wildcard
	it("should return the match array ['123', 'abc'] for the match '/project/123/task/abc' based on the wildcard pattern '/project/*/task/*'", function() {
		var ms = matchstick('/project/*/task/*', 'wildcard');
		ms.match('/project/123/task/abc');
		assert.deepEqual(ms.matches, ['123', 'abc']);
	});

	// Template
	it("should return the match object {'pid': '123', 'tid': 'abc'} for the match '/project/123/task/abc' based on the template pattern '/project/{pid}/task/{tid}'", function() {
		var ms = matchstick('/project/{pid}/task/{tid}', 'template');
		ms.match('/project/123/task/abc');
		assert.deepEqual(ms.matches, {
			'pid' : '123',
			'tid': 'abc'
		});
	});

	// Symbolic
	it("should return the match object {'pid': '123', 'tid': 'abc'} for the match '/project/123/task/abc' based on the symbolic pattern '/project/:pid/task/:tid'", function() {
		var ms = matchstick('/project/:pid/task/:tid', 'symbolic');
		ms.match('/project/123/task/abc');
		assert.deepEqual(ms.matches, {
			'pid' : '123',
			'tid': 'abc'
		});
	});

	// RegExp
	it("should return the match array ['123', 'abc'] for the match '/project/123/task/abc' based on the regexp pattern '^/project/(.*)/task/(.*)$'", function() {
		var ms = matchstick('^/project/(.*)/task/(.*)$', 'regexp');
		ms.match('/project/123/task/abc');
		assert.deepEqual(ms.matches, ['123', 'abc']);
	});

    // Multiline
    it("should return the match object {'pid': '1\\n\\t\\n23', 'tid': 't\\nest'} for the match '/1\\n\\t\\n23/task: t\\nest' based on the template pattern '/{pid}/task: {tid}'", function() {
        var ms = matchstick('/{pid}/task: {tid}', 'template', 'd');
        ms.match('/1\n\t\n23/task: t\nest');
        assert.deepEqual(ms.matches, {
            'pid' : '1\n\t\n23',
            'tid': 't\nest'
        });
    });

});
