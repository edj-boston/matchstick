Matchstick
==========
[![npm](https://img.shields.io/npm/v/matchstick.svg)](https://www.npmjs.com/package/matchstick)
[![Build Status](https://api.travis-ci.org/edj-boston/matchstick.svg?branch=master)](https://travis-ci.org/edj-boston/matchstick) [![Coverage Status](https://coveralls.io/repos/edj-boston/matchstick/badge.svg?branch=master&service=github)](https://coveralls.io/github/edj-boston/matchstick?branch=master) [![Dependency Status](https://david-dm.org/edj-boston/matchstick.svg)](https://david-dm.org/edj-boston/matchstick) [![devDependency Status](https://david-dm.org/edj-boston/matchstick/dev-status.svg)](https://david-dm.org/edj-boston/matchstick#info=devDependencies)

A [NodeJS module](https://www.npmjs.org/package/matchstick) that converts string patterns into regular expressions. It can also tokenize and perform string replacement. It's useful for route handling or simple template systems.


Installation
------------

Install using NPM.

```sh
$ npm install matchstick
```

You may require `sudo` depending on your local configuration.


Usage
-----

Require matchstick at the top of your script.

```js
var matchstick = require('matchstick');
```


### Arguments

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

Matchstick is a constructor that returns a fresh instance so you don't need the `new` keyword.

```js
> var ms = matchstick('/project/{pid}/task/{tid}', 'template');
> ms

  {
  	pattern  : '/project/{pid}/task/{tid}',
  	mode     : 'template',
  	tokens   : [
  		'pid',
  		'tid'
  	],
  	regexp  : /^\/project\/(.*)\/task\/(.*)$/,
  	matches : null,
  	match   : function() {},
  	stick   : function() {}
  }
```

Set it to a variable and use the match method to return `true` or `false`

```js
> var ms = matchstick('/path', 'static')
> ms.match('/path/')

  true
```


Dynamic Properties
------------------

### Tokens

Template and symbolic modes populate the `tokens` property with an array representing the token names in the order they appear in the pattern.

```js
> var ms = matchstick('/project/{pid}/task/{tid}', 'template')
> ms.tokens

  ['pid', 'tid']
```


### Matches

The matches property will always contain the latest results of a `match()` call.

__Wildcard__ and __RegExp__ modes populate the `matches` property with an array of strings representing the order in which they are captured.

```js
> var ms = matchstick('/project/{pid}/task/{tid}', 'template')
> ms.match('/project/123/task/abc');
> ms.matches

  ['123', 'abc']
```

__Template__ and __symbolic__ modes populate the `matches` property with an object with tokens and strings as key/value pairs.

```js
> var ms = matchstick('/project/{pid}/task/{tid}', 'template')
> ms.match('/project/123/task/abc');
> ms.matches

  {pid:'123', tid:'abc'}
```


### RegExp

All patterns populate the `regexp` property which you can access directly if needed.

```js
> var ms = matchstick('^\/path\/$', 'regexp', 'g')
> ms.regexp

  /^/path/$/g
```


Methods
-------

### Match

#### Static mode

```js
> matchstick('/path/', 'static').match('/PATH/')

  true
```

#### Wildcard mode

```js
> matchstick('/path/*/', 'wildcard').match('/path/something/')

  true
```

#### Regexp mode

```js
> matchstick('^\/path\/$', 'regexp').match('/path/')

  true
```


### Stick

#### Template Mode

```js
> var ms = matchstick('/project/{pid}/task/{tid}', 'pattern');
> ms.stick({pid:'123', tid:'abc'});

  /project/123/task/abc
```


#### Symbolic Mode

```js
> var ms = matchstick('/project/:pid/task/:tid/action/:aid', 'pattern');
> ms.stick({pid:'123', tid:'abc'});

  /project/123/task/abc/action/
```

Note: Unused tokens are removed


Development
-----------

Clone the [github repo](https://github.com/edj-boston/matchstick), `cd` to the directory, install the dependencies with NPM, and run `gulp`.

```sh
$ cd matchstick
$ npm install
$ gulp
```

Gulp will watch the `lib` and `test` directories and re-run the tests for you. gulp will also lint the files and report test coverage.

If you submit a pull request, please follow these guidelines:

1. Use separate PR's for individual features or bugs
2. Keep test coverage at 100%
3. Update the documentation in this README
