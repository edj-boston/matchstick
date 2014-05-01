Matchstick
==========

A utility for turning string patterns into a regular expressions. Also tokenizes a string and can perform replacement. Useful for matching URLs to routes.


Installation
------------

	$ npm install matchstick


Usage
-----

Require matchstick at the top of your script.

	var matchstick = require("matchstick");


Matchstick is a constructor that returns a fresh instance so you don't need the _new_ keyword. It takes three arguments:	

* __pattern__ is a string representing a search
* __mode__ is a string that tells matchstick how to interpret the pattern
	* _strict:_ Exact match
	* _static:_ Exact match with optional trailing slash
	* _wildcard:_ Asterisks match any character(s) _e.g._ `/path/*/`
	* _template:_ Curly brace tokens match any character(s) _e.g._ `/path/{token}/`
	* _colon:_ Ruby-style tokens with leading colons match any character(s) _e.g._ `/path/:token/`
	* _regexp:_ Convert into a true RegExp Object _e.g._ `^\/path\/$`
* __modifiers__ is a string containing one (or none) of any of the following characters
	* _i:_ Case insensitive
	* _g:_ Global match
	* _m:_ Multiline matching

### Example

	> matchstick('/project/{projectid}/task/{taskid}', 'template');

Returns:

	{
		pattern : '/project/{projectid}/task/{taskid}',
		mode : 'template',
		tokens : [
			'projectid',
			'taskid'
		],
		regexp : /^\/project\/(.*)\/task\/(.*)$/
		replace : function() {}
		test : function() {}
	}

Set it to a variable and use the test method to return true or false

	var ms = matchstick('/path', 'static');
	ms.test('/path/');

Returns: `true`


...or evaluate it directly.

	var path = '/path/';
	if( matchstick('/path', 'static', 'i').test(str) ) {
		// Do something
	}


Examples
--------

### Regexp property

All patterns result in a regexp property which you can access directly.

	matchstick('^\/path\/$', 'regexp', 'ig').regexp;

Returns: `/^/path/$/gi`

### test() method

#### Static mode

	matchstick('/path/', 'static').test('/PATH/');

Returns: `true`

#### Wildcard mode

	matchstick('/path/*/', 'wildcard').test('/path/something/');

Returns: `true`

#### Regexp mode

	matchstick('^\/path\/$', 'regexp').test('/path/');

Returns: `true`

### replace() method

#### template mode

	var ms = matchstick('/project/{projectid}/task/{taskid}', 'pattern');
	ms.replace({
		projectid : '123', 
		taskid : 'abc'
	});

Returns: `/project/123/task/abc`

#### colon mode

	var ms = matchstick('/project/:pid/task/:tid/action/:aid', 'pattern');
	ms.replace({
		projectid : '123', 
		taskid : 'abc'
	});

Returns: `/project/123/task/abc/action/` (unused tokens are removed)


Tests
-----

Install the global dependancies with sudo permissions.

	$ sudo npm install -g mocha
	$ sudo npm install -g should


Run mocha directly to see the test results.

	$ cd matchstick
	$ mocha