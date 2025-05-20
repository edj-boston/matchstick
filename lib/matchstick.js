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
        function escapeRegExp (str) {
            // Removed ( ) | from the list of characters to escape
            return str.replace(/[\-\[\]\/\{\}\*\+\?\.\\\^\$]/g, '\\$&');
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
            // Check for invalid characters
            const invalidCharMatch = modifiers.match(/[^igm]/);
            if (invalidCharMatch) {
                throw new Error(`[Matchstick] Invalid modifier character '${invalidCharMatch[0]}'`);
            }

            // Check for duplicate characters
            const chars = modifiers.split('');
            if (new Set(chars).size !== chars.length) {
                // Find the first duplicated character for the error message
                const duplicateChar = chars.find((char, index) => chars.indexOf(char) !== index);
                throw new Error(`[Matchstick] Duplicate modifier character '${duplicateChar}'`);
            }

            this.modifiers = modifiers;
        }


        /* *
         * Dynamically build the 'regex' property
         */

        // Different behaviors for each mode
        switch (mode) {
            case 'strict': {// Exact match
                pattern = escapeRegExp(pattern);
                this.regexp = new RegExp(`^${pattern}$`, modifiers);
                break;
            }

            case 'static': {// Static match with an optional trailing slash
                pattern = escapeRegExp(pattern);
                this.regexp = new RegExp(`^${pattern}(/?)$`, modifiers);
                break;
            }

            case 'wildcard': { // The '*' character matches any character(s)
                pattern = escapeRegExp(pattern)
                    .replace(/\\*/g, '(.*)');
                this.regexp = new RegExp(`^${pattern}$`, modifiers);
                break;
            }

            case 'template': { // A '{token}' string matches any character(s)
                this.tokens = [];
                let buff = '';
                const tokenRegex = /({[^/.]*})/g;
                const parts = pattern.split(tokenRegex).filter(part => part !== '');

                parts.forEach(part => {
                    if (/^({[^/.]*})$/.test(part)) {
                        const tokenName = part.substring(1, part.length - 1);
                        this.tokens.push(tokenName);
                        buff += '(.*)';
                    } else {
                        buff += escapeRegExp(part);
                    }
                });
                this.regexp = new RegExp(`^${buff}$`, modifiers);
                break;
            }

            case 'symbolic': { // A ':symbol' string matches any character(s)
                this.tokens = [];
                let buff = '';
                const tokenRegex = /(:[a-z0-9]*)/g;
                const parts = pattern.split(tokenRegex).filter(part => part !== '');

                parts.forEach(part => {
                    if (/^(:[a-z0-9]*)$/.test(part)) {
                        const tokenName = part.substring(1);
                        this.tokens.push(tokenName);
                        buff += '(.*)';
                    } else {
                        buff += escapeRegExp(part);
                    }
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
