// External dependancies
var assert = require('assert'),
	should = require('should'),
	matchstick = require('../matchstick.js');


// Test the replace() method
describe('Matchstick.replace()', function() {

	// Template
	it("should '/project/{pid}/task/{tid}' matches '/project/123/task/abc' as a template match", function() {
		var ms = matchstick('/project/{pid}/task/{tid}', 'template');
		var obj = {
			pid : '123',
			tid : 'abc'
		};
		assert.equal(ms.replace(obj), '/project/123/task/abc');
	});

});