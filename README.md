# Matchstick [![Build Status](https://travis-ci.org/edj-boston/matchstick.svg?branch=master)](https://travis-ci.org/edj-boston/matchstick)

A small library for conveting various string patterns into regular expressions. It can also tokenize a string and can perform replacement from a data object. It's especially useful for route handling.


Installation
------------

	$ npm install matchstick


Usage
-----

Require matchstick at the top of your script.

	var matchstick = require('matchstick');

Matchstick is a constructor that returns a fresh instance so you don't need the _new_ keyword. It takes three arguments:	

* __pattern__ is a string representing a search
* __mode__ is a string that tells matchstick how to interpret the pattern
	* _strict:_ Exact match
	* _static:_ Exact match with optional trailing slash (for URLs)
	* _wildcard:_ Asterisks match any character(s) _e.g._ `/path/*/`
	* _template:_ Curly brace tokens match any character(s) _e.g._ `/path/{token}/`
	* _symbolic:_ Ruby-style symbols with leading colons match any character(s) _e.g._ `/path/:token/`
	* _regexp:_ Convert into a true RegExp Object _e.g._ `^\/path\/$`
* __modifiers__ is a string containing one (or none) of any of the following characters
	* _i:_ Case insensitive
	* _g:_ Global match
	* _m:_ Multiline matching

### Example

	> matchstick('/project/{projectid}/task/{taskid}', 'template');

Returns:

	{
		pattern  : '/project/{projectid}/task/{taskid}',
		mode     : 'template',
		tokens   : [
			'projectid',
			'taskid'
		],
		regexp  : /^\/project\/(.*)\/task\/(.*)$/,
		match   : function() {},
		stick : function() {}
	}

Set it to a variable and use the match method to return true or false

	var ms = matchstick('/path', 'static');
	ms.match('/path/');

Returns: `true`


...or evaluate it directly.

	var path = '/path/';
	if( matchstick('/path', 'static', 'i').match(str) ) {
		// Do something
	}


Examples
--------

### Regexp property

All patterns result in a regexp property which you can access directly.

	matchstick('^\/path\/$', 'regexp', 'g').regexp;

Returns: `/^/path/$/gi`

### match() method

#### Static mode

	matchstick('/path/', 'static').match'('/PATH/');

Returns: `true`

#### Wildcard mode

	matchstick('/path/*/', 'wildcard').match('/path/something/');

Returns: `true`

#### Regexp mode

	matchstick('^\/path\/$', 'regexp').match('/path/');

Returns: `true`

### stick() method

#### Template mode

	var ms = matchstick('/project/{projectid}/task/{taskid}', 'pattern');
	ms.stick({
		projectid : '123', 
		taskid : 'abc'
	});

Returns: `/project/123/task/abc`

#### Symbolic mode

	var ms = matchstick('/project/:pid/task/:tid/action/:aid', 'pattern');
	ms.stick({
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