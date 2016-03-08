'use strict';

class Matchstick {
    constructor (pattern, mode, modifiers) {
        this.pattern   = ''; // Original pattern passed as argument
        this.mode      = ''; // Mode string must be one of validModes array below
        this.modifiers = null; // Modifier string passed as argument for 'regexp' mode
        this.matches   = null, // Array of matches for wildcard type, or obj for template/symbolic types
        this.tokens    = null; // Tokens array for 'template' and 'symbolic' modes
        this.regexp    = new RegExp(); // The calculated regex object

        // Helper function to escape a regexp string
        function escapeRegExp (str, asterisks) {
            const regexp = (asterisks) ? /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g : /[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g;
            return str.replace(regexp, '\\$&');
        }

        /* *
         * Validation
         */

        // Validate the 'pattern' argument
        if (typeof pattern == 'string') {
            this.pattern = pattern;
        } else {
            throw new Error('[Matchstick] The \'pattern\' property must be a string');
        }

        // Validate the 'mode' argument
        const validModes = [ 'strict', 'static', 'wildcard', 'template', 'symbolic', 'regexp' ];
        if (validModes.indexOf(mode) >= 0) {
            this.mode = mode;
        } else {
            throw new Error(`[Matchstick] The 'mode' property must be one of ${validModes.join(', ')}`);
        }

        // Validate the 'modifiers' argument
        if (modifiers) {
            const validModifiers = [ 'i', 'g', 'm' ];

            modifiers.split('').forEach((mod, pos, arr) => {
                if (validModifiers.indexOf(mod) < 0) {
                    throw new Error(`[Matchstick] Invalid modifier character '${mod}'`);
                }

                if (arr.indexOf(mod) != pos) {
                    throw new Error(`[Matchstick] Duplicate modifier character '${mod}'`);
                }
            });

            this.modifiers = modifiers;
        }


        /* *
         * Dynamically build the 'regex' property
         */

        // Different behaviors for each mode
        switch (mode) {
            case 'strict': {// Exact match
                pattern = escapeRegExp(pattern, true);
                this.regexp = new RegExp(`^${pattern}$`, modifiers);
                break;
            }

            case 'static': {// Static match with an optional trailing slash
                pattern = escapeRegExp(pattern, true);
                this.regexp = new RegExp(`^${pattern}(/?)$`, modifiers);
                break;
            }

            case 'wildcard': { // The '*' character matches any character(s)
                pattern = escapeRegExp(pattern, false)
                    .replace(/[\*]/g, '(.*)');
                this.regexp = new RegExp(`^${pattern}$`, modifiers);
                break;
            }

            case 'template': {// A '{token}' string matches any character(s)
                this.tokens = [];
                let buff = escapeRegExp(pattern, false);
                pattern.match(new RegExp('({[^/.]*})', 'g')).forEach(token => {
                    token = token.substring(1, token.length - 1); // Remove leading/trailing curly brace char
                    this.tokens.push(token);
                    buff = buff.replace(new RegExp(`\\\\{${token}\\\\}`, 'g'), '(.*)'); // Replace tokens with catch-alls
                });
                this.regexp = new RegExp(`^${buff}$`, modifiers);
                break;
            }

            case 'symbolic': { // A ':symbol' string matches any character(s)
                this.tokens = [];
                let buff = escapeRegExp(pattern, false);
                pattern.match(new RegExp('(:[a-z0-9]*)', 'g')).forEach(token => {
                    token = token.substring(1, token.length); // Remove leading colon char
                    this.tokens.push(token);
                    buff = buff.replace(new RegExp(`:${token}`, 'g'), '(.*)'); // Replace tokens with catch-alls
                });
                this.regexp = new RegExp(`^${buff}$`, modifiers);
                break;
            }

            case 'regexp': { // Convert directly into a native RegExp object
                this.regexp = new RegExp(pattern, modifiers);
                break;
            }
        }
    }


    // Public method to test the regexp against a string and return true/false
    match (str) {
        this.matches = null;

        // Helper function that returns an object of matches
        const matchesObject = matchStr => {
            const result = this.regexp.exec(matchStr);
            if (result) {
                this.tokens.forEach((el, i) => {
                    this.matches[el] = result[i + 1];
                }, this);
                return true;
            } else {
                return false;
            }
        };

        // Helper function that returns an array of matches
        const matchesArray = matchStr => {
            const result = this.regexp.exec(matchStr);
            if (result) {
                this.matches = result.slice(1, result.length);
                return true;
            } else {
                return false;
            }
        };

        // Handle modes differently
        switch (this.mode) {
            case 'wildcard': {
                this.matches = [];
                return matchesArray(str);
            }
            case 'template': {
                this.matches = {};
                return matchesObject(str);
            }
            case 'symbolic': {
                this.matches = {};
                return matchesObject(str);
            }
            case 'regexp': {
                this.matches = [];
                return matchesArray(str);
            }
            default: {
                return this.regexp.test(str);
            }
        }
    }


    // Public method to perform string replacement
    stick (obj) {
        let str = this.pattern;
        let scrub = null, swap;

        // Handle the two token modes differently
        switch (this.mode) {
            case 'template': {
                swap = function (swapStr, token, val) {
                    return swapStr.replace(`{${token}}`, val);
                };
                scrub = function (scrubStr) {
                    return scrubStr.replace(/{([^{.]*)}/g, '');
                };
                break;
            }
            case 'symbolic': {
                swap = function (swapStr, token, val) {
                    return swapStr.replace(`:${token}`, val);
                };
                scrub = function (scrubStr) {
                    return scrubStr.replace(/:([^/.]*)/g, '');
                };
                break;
            }
            default: {
                throw new Error(`[Matchstick] Cannot call replace method on '${this.mode}' type`);
            }
        }

        // Replace the tokens with values
        this.tokens.forEach(token => {
            if (obj.hasOwnProperty(token)) {
                str = swap(str, token, obj[token]);
            }
        });

        // Scrub unused tokens
        str = scrub(str);

        // Return our str with values
        return str;
    }
}

// Export the constructor
module.exports = function (pattern, mode, modifiers) {
    return new Matchstick(pattern, mode, modifiers);
};
