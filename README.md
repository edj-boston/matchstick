Matchstick
==========

A utility for turning string patterns into a regular expressions. Useful for matching URLs to routes.

Version 0.1.0 is a work in progress with passing tests. More tests to come. As well as functionality to 


Installation
------------

	npm install matchstick


Usage
-----

Require matchstick at the top of your script.

	var matchstick = require("matchstick");


Matchstick takes three arguments.

	matchstick(pattern, mode, modifiers)

Matchstick is a constructor that returns a fresh instance so you don't need the _new_ keyword.

* _pattern_ is a string representing a search
* _mode_ is a string that tells matchstick how to interpret the pattern
	* 'static' Static match with or without modifiers
	* 'wildcard' Asterisks match any character(s) _e.g._ '/path/*/'
	* 'regexp' Convert into a true RegExp Object _e.g._ '^\/path\/$'
* _modifiers_ is a string containing one (or none) of any of the following characters
	* 'i' Case insensitive
	* 'g' Global match
	* 'm' Multiline matching

Set it to a variable and use the test method to return true or false

	var ms = matchstick('pattern', 'strict');
	ms.test('pattern');

	// Returns true


...or evaluate it directly.

	var str = 'string';
	if( matchstick('string', 'static', 'i').test(str) ) {
		// Do something
	} else {
		// Or not
	}


Examples
--------

### Regexp property

All patterns result in a regexp property which you can access directly.

	matchstick('^\/path\/$', 'regexp', 'ig').regexp;
	// Returns /^/path/$/gi


### Static mode

	matchstick('/path/', 'static', 'i').test('/PATH/');
	// Returns true


### Wildcard mode

	matchstick('/path/*/', 'wildcard', 'i').test('/path/something/');
	// Returns true


### Regexp mode

	matchstick('^\/path\/$', 'regexp').test('/path/');
	// Return true


Tests
-----

Install the global dependancies with sudo permissions.

	sudo npm install -g mocha
	sudo npm install -g should


Run mocha directly to see the test results.

	$ cd matchstick
	$ mocha