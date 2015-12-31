// Cosntructor
var Matchstick = function( pattern, mode, modifiers ) {

    // Defaults
    this.pattern   = ''; // Original pattern passed as argument
    this.mode      = ''; // Mode string must be one of validModes array below
    this.modifiers = null; // Modifier string passed as argument for 'regexp' mode
    this.matches   = null, // Array of matches for wildcard type, or obj for template/symbolic types
    this.tokens    = null; // Tokens array for 'template' and 'symbolic' modes
    this.regexp    = new RegExp(); // The calculated regex object

    /* *
     * Validation
     */

    // Validate the 'pattern' argument
    if ( typeof pattern == 'string' )
        this.pattern = pattern;
    else
        throw new Error("[Matchstick] The 'pattern' property must be a string");

    // Validate the 'mode' argument
    var validModes = [ 'strict', 'static', 'wildcard', 'template', 'symbolic', 'regexp' ];
    if ( validModes.indexOf(mode) >= 0 )
        this.mode = mode;
    else
        throw new Error("[Matchstick] The 'mode' property must be one of " + validModes.join(', ') );

    // Validate the 'modifiers' argument
    if ( modifiers ) {
        var validModifiers = [
            'i', // Case insensitive
            'g', // Global match
            'm'  // Multiline matching
        ];
        for (var i in modifiers.split('')) {
            var mod = modifiers[i];
            if ( validModifiers.indexOf(mod) >= 0 )
                validModifiers.splice(validModifiers.indexOf(mod), 1);
            else
                throw new Error("[Matchstick] Invalid modifier character '" + mod + "'");
        }
        this.modifiers = modifiers;
    }


    /* *
     * Dynamically build the 'regex' property
     */

    // Different behaviors for each mode
    switch ( mode ) {

    case 'strict': // Exact match
        pattern = escapeRegExp(pattern, true);
        this.regexp = new RegExp('^' + pattern + '$', modifiers);
        break;

    case 'static': // Static match with an optional trailing slash
        pattern = escapeRegExp(pattern, true);
        this.regexp = new RegExp('^' + pattern + '(/?)$', modifiers);
        break;

    case 'wildcard': // The '*' character matches any character(s)
        pattern = escapeRegExp(pattern, false);
        pattern = pattern.replace(/[\*]/g, "(.*)");
        this.regexp = new RegExp('^' + pattern + '$', modifiers);
        break;

    case 'template': // A '{token}' string matches any character(s)
        this.tokens = [];
        var buff = escapeRegExp(pattern, false);
        var arr = pattern.match(new RegExp('({[^/.]*})', 'g'));
        for (i in arr) {
            var token = arr[i].substring(1, arr[i].length-1); // Remove leading/trailing curly brace char
            this.tokens.push(token);
            buff = buff.replace(new RegExp('\\\\{' + token + '\\\\}', 'g'), '(.*)'); // Replace tokens with catch-alls
        }
        this.regexp = new RegExp('^' + buff + '$', modifiers);
        break;

    case 'symbolic': // A ':symbol' string matches any character(s)
        this.tokens = [];
        buff = escapeRegExp(pattern, false);
        arr = pattern.match(new RegExp('(:[a-z0-9]*)', 'g'));
        for (i in arr) {
            token = arr[i].substring(1, arr[i].length); // Remove leading/trailing curly brace char
            this.tokens.push(token);
            buff = buff.replace(new RegExp(':' + token, 'g'), '(.*)'); // Replace tokens with catch-alls
        }
        this.regexp = new RegExp('^' + buff + '$', modifiers);
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


// Public method to test the regexp against a string and return true/false
Matchstick.prototype.match = function( str ) {
    this.matches = null;

    // Helper function that returns an object of matches
    var matchesObject = function(str) {
        var result = this.regexp.exec(str);

        // Populate the matches property if we have a result and return true
        if ( result ) {

            this.tokens.forEach(function(el, i) {
                this.matches[el] = result[i + 1];
            }, this);

            return true;

        // Otherwise return false
        } else return false;
    }.bind(this);

    // Helper function that returns an array of matches
    var matchesArray = function(str) {
        var result = this.regexp.exec(str);

        // Populate the matches property if we have a result and return true
        if ( result ) {

            this.matches = result.slice(1, result.length);
            return true;

        // Otherwise return false
        } else return false;
    }.bind(this);

    // Handle modes differently
    switch ( this.mode ) {

    case 'wildcard':
        this.matches = [];
        return matchesArray(str);

    case 'template':
        this.matches = {};
        return matchesObject(str);

    case 'symbolic':
        this.matches = {};
        return matchesObject(str);

    case 'regexp':
        this.matches = [];
        return matchesArray(str);

    default:
        return this.regexp.test(str);

    }

};


// Public method to perform string replacement
Matchstick.prototype.stick = function( obj ) {
    var str = this.pattern;
    var swap, scrub = null;

    // Handle the two token modes differently
    switch ( this.mode ) {

    case 'template':
        swap = function( str, token, val ) {
            return str.replace('{' + token + '}', val);
        };
        scrub = function(str) {
            return str.replace(/{([^{.]*)}/g, '');
        };
        break;

    case 'symbolic':
        swap = function( str, token, val ) {
            return str.replace(':' + token, val);
        };
        scrub = function(str) {
            return str.replace(/:([^/.]*)/g, '');
        };
        break;

    default:
        throw new Error("[Matchstick] Cannot call replace method on '" + this.mode + "' type");

    }

    // Replace the tokens aith values
    for (var i in this.tokens) {
        var token = this.tokens[i];
        if ( obj.hasOwnProperty(token) )
            str = swap(str, token, obj[token]);
    }

    // Scrub unused tokens
    str = scrub(str);

    // Return our str with values
    return str;
};


// Export the constructor
module.exports = function( pattern, mode, modifiers ) {
    return new Matchstick(pattern, mode, modifiers);
};