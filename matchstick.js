// Cosntructor
var Matchstick = function( pattern, mode, modifiers ) {

	this.pattern = '';
	this.tokens = [];
	this.regexp = new RegExp();

	/* *
	 * Validation
	 */

	// Validate the 'pattern' argument
	if( typeof pattern != 'string' ) throw new Error("[Matchstick] The 'pattern' property must be a string");

	// Validate the 'mode' argument
	var validModes = [ 'strict', 'static', 'wildcard', 'template', 'colon', 'regexp' ];
	if( validModes.indexOf(mode) < 0 ) throw new Error("[Matchstick] The 'mode' property must be one of " + validModes.join(', ') );

	// Validate the 'modifiers' argument
	if( modifiers ) {
		var validModifiers = [
			'i', // Case insensitive
			'g', // Global match
			'm'  // Multiline matching
		];
		for(i in modifiers.split('')) {
			var mod = modifiers[i];
			if( validModifiers.indexOf(mod) >= 0 ) {
				validModifiers.splice(validModifiers.indexOf(mod), 1);
			} else {
				throw new Error("[Matchstick] Invalid modifier character '" + mod + "'");
			}
		}
	}


	/* *
	 * Dynamically build the 'regex' property
	 */

	// Different behaviors for each mode
	switch( mode ) {

		case 'strict': // Exact match
			pattern = escapeRegExp(pattern);
			this.regexp = new RegExp('^' + pattern + '$', modifiers);
			break;

		case 'static': // Static match with an optional trailing slash
			pattern = escapeRegExp(pattern);
			this.regexp = new RegExp('^' + pattern + '(/?)$', modifiers);
			break;

		case 'wildcard': // The '*' character matches any character(s)
			pattern = escapeRegExp(pattern, false);
			pattern = pattern.replace(/[\*]/g, "(.*)");
			this.regexp = new RegExp('^' + pattern + '$', modifiers);
			break;

		case 'template': // A '{token}' string matches any character(s)
			var buff = escapeRegExp(pattern, false);
			var arr = pattern.match(new RegExp('(\\{[^/.]*\\})', 'gi'));
			for(i in arr) {
				var token = arr[i].substring(1, arr[i].length-1); // Remove leading/trailing curly brace char
				this.tokens.push(token);
				buff = buff.replace(new RegExp('\\\\{' + token + '\\\\}', 'g'), '(.*)'); // Replace tokens with catch-alls
			}
			this.regexp = new RegExp('^' + buff + '$', modifiers);
			break;

		case 'colon': // A ':colon' string matches any character(s)
			this.regexp = new RegExp('^' + pattern + '$', modifiers);
			this.tokens = pattern.match(new RegExp('(:[^/.]*)', 'gi'));
			for(i in arr) arr[i] = arr[i].substring(1, arr[i].length); // Remove leading colon char
			break;

		case 'regexp': // Convert directly into a native RegExp object
			this.regexp = new RegExp(pattern, modifiers);
			break;

	}


	// Helper function to escape a regexp string
	function escapeRegExp(str, asterisks) {
		var regexp = (asterisks) ? /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g : /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g;
		return str.replace(regexp, "\\$&");
	}


	// Return the object for chaining
	return this;
};

// Public method to test the regexp and return true or false
Matchstick.prototype.test = function( str ) {
	return this.regexp.test(str);
};

// Public method to perform string replacement
Matchstick.prototype.replace = function( str, obj ) {
	for(token in this.tokens) {
		str.replace(token)
	}
	return ;
}

// Export the constructor
module.exports = function( pattern, mode, modifiers ) {
	return new Matchstick(pattern, mode, modifiers);
};