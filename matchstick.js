// Cosntructor
var Matchstick = function( pattern, mode, modifiers ) {

	// Defaults
	this.pattern   = ''; // Original pattern passed as argument
	this.mode      = ''; // Mode string must be one of validModes array below
	this.modifiers = null; // Modifier string passed as argument for 'regexp' mode
	this.matches   = null, // Array of matches for wildcard type, or obj for template/symbolic types
	this.tokens    = null; // Tokens array for 'template' and 'symbolic' modes
	this.regexp    = new RegExp(); // The calculated regex object
    this.match_all  = '(.*)'; // Match tokens by this regex

	/* *
	 * Validation
	 */

	// Validate the 'pattern' argument
	if( typeof pattern == 'string' ) {
		this.pattern = pattern;
	} else {
		throw new Error("[Matchstick] The 'pattern' property must be a string");
	}

	// Validate the 'mode' argument
	var validModes = [ 'strict', 'static', 'wildcard', 'template', 'symbolic', 'regexp' ];
	if( validModes.indexOf(mode) >= 0 ) {
		this.mode = mode;
	} else {
		throw new Error("[Matchstick] The 'mode' property must be one of " + validModes.join(', ') );
	}

	// Validate the 'modifiers' argument
	if( modifiers ) {
		var validModifiers = [
			'i', // Case insensitive
			'g', // Global match
			'm',  // Multiline matching
            'd'// Use dotall for multiline regexps

		];
		for(i in modifiers.split('')) {
			var mod = modifiers[i];
			if( validModifiers.indexOf(mod) >= 0 ) {
				validModifiers.splice(validModifiers.indexOf(mod), 1);
                if (mod == 'd')
                    this.match_all = '([\\s\\S]+)';

			} else {
				throw new Error("[Matchstick] Invalid modifier character '" + mod + "'");
			}
		}
        modifiers = modifiers.replace('d', ''); // remove d flag
		this.modifiers = modifiers;
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
			this.tokens = [];
			var buff = escapeRegExp(pattern);
			var arr = pattern.match(new RegExp('({[^/.]*})', 'g'));
			for(i in arr) {
				var token = arr[i].substring(1, arr[i].length-1); // Remove leading/trailing curly brace char
				this.tokens.push(token);
				buff = buff.replace(new RegExp('\\\\{' + token + '\\\\}', 'g'), this.match_all); // Replace tokens with catch-alls
			}
			this.regexp = new RegExp('^' + buff + '$', modifiers);
			break;

		case 'symbolic': // A ':symbol' string matches any character(s)
			this.tokens = [];
			var buff = escapeRegExp(pattern, false);
			var arr = pattern.match(new RegExp('(:[a-z0-9]*)', 'g'));
			for(i in arr) {
				var token = arr[i].substring(1, arr[i].length); // Remove leading/trailing curly brace char
				this.tokens.push(token);
				buff = buff.replace(new RegExp(':' + token, 'g'), this.match_all); // Replace tokens with catch-alls
			}
			this.regexp = new RegExp('^' + buff + '$', modifiers);
			break;

		case 'regexp': // Convert directly into a native RegExp object
			this.regexp = new RegExp(pattern, modifiers);
			break;

	}


	// Helper function to escape a regexp string
	function escapeRegExp(str, asterisks) {
        // /[|\\{}()[\]^$+*?.]/g
		var regexp = (asterisks) ? /[|\\/{}()[\]^$+*?.]/g : /[|\\/{}()[\]^$+?.]/g;
		return str.replace(regexp, "\\$&");
	}


	// Return the object for chaining
	return this;
};


// Public method to test the regexp against a string and return true/false
Matchstick.prototype.match = function( str ) {
	this.matches = null;
	var that = this;

	// Helper function that returns an object of matches
	var matchesObject = function(str) {
		var result = that.regexp.exec(str);

		// Populate the matches property if we have a result and return true
		if( result ) {

			that.tokens.forEach(function(el, i) {
				that.matches[el] = result[i + 1];
			}, that);

			return true;

		// Otherwise return false
		} else {
			return false;
		}
	}

	// Helper function that returns an array of matches
	var matchesArray = function(str) {
		var result = that.regexp.exec(str);

		// Populate the matches property if we have a result and return true
		if( result ) {

			that.matches = result.slice(1, result.length);
			return true;

		// Otherwise return false
		} else {
			return false;
		}
	}

	// Handle modes differently
	switch( this.mode ) {

		case 'wildcard':
			this.matches = [];
			return matchesArray(str);
			break;

		case 'template':
			this.matches = {};
			return matchesObject(str);
			break;

		case 'symbolic':
			this.matches = {};
			return matchesObject(str);
			break;

		case 'regexp':
			this.matches = [];
			return matchesArray(str);
			break;

		default:
			return this.regexp.test(str);
			break;

	}

}


// Public method to perform string replacement
Matchstick.prototype.stick = function( obj ) {
	var str = this.pattern;

	// Handle the two token modes differently
	switch( this.mode ) {
		case 'template':
			var swap = function( str, token, val ) {
				return str.replace('{' + token + '}', val);
			}
			var scrub = function(str) {
				return str.replace(/{([^{.]*)}/g, '');
			}
			break;
		case 'symbolic':
			var swap = function( str, token, val ) {
				return str.replace(':' + token, val);
			}
			var scrub = function(str) {
				return str.replace(/:([^/.]*)/g, '');
			}
			break;
		default:
			throw new Error("[Matchstick] Cannot call replace method on '" + this.mode + "' type");
			break;
	}

	// Replace the tokens aith values
	for(i in this.tokens) {
		token = this.tokens[i];
		if( obj.hasOwnProperty(token) ) {
			str = swap(str, token, obj[token]);
		}
	}

	// Scrub unused tokens
	str = scrub(str);

	// Return our str with values
	return str;
}


// Export the constructor
module.exports = function( pattern, mode, modifiers ) {
	return new Matchstick(pattern, mode, modifiers);
};
