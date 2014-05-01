// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the replace() method
describe('Matchstick.replace(obj)', function() {

	// Template
	it("should return '/project/123/task/abc' given the pattern '/project/{pid}/task/{tid}' and {pid:'123', tid:'abc'} data", function() {
		var ms = matchstick('/project/{pid}/task/{tid}', 'template');
		var obj = {
			pid : '123',
			tid : 'abc'
		};
		assert.equal(ms.replace(obj), '/project/123/task/abc');
	});

	// Colon
	it("should return '/project/123/task/abc' given the pattern '/project/:pid/task/:tid' and {pid:'123', tid:'abc'} data", function() {
		var ms = matchstick('/project/:pid/task/:tid', 'colon');
		var obj = {
			pid : '123',
			tid : 'abc'
		};
		assert.equal(ms.replace(obj), '/project/123/task/abc');
	});

});