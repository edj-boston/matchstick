'use strict';

const ms = require('../lib/matchstick.js');


describe('#match()', () => {
    it('should perform accurate strict matches', () => {
        ms('/path', 'strict')
            .match('/path/')
            .should.be.false;
    });

    it('should perform accurate static matches', () => {
        ms('/path', 'static')
            .match('/path/')
            .should.be.true;
    });

    it('should perform accurate case-insensative static matches', () => {
        ms('/path', 'static', 'i')
            .match('/PATH')
            .should.be.true;
    });

    it('should perform accurate wildcard matches', () => {
        ms('/path/*/', 'wildcard')
            .match('/path/something/')
            .should.be.true;
    });

    it('should perform accurate template matches', () => {
        ms('/project/{pid}/task/{tid}', 'template')
            .match('/project/123/task/abc')
            .should.be.true;
    });

    it('should perform accurate regular expression matches', () => {
        ms('^\/path\/$', 'regexp')
            .match('/path/')
            .should.be.true;
    });

    it('should return false for a non-match on a symbolic type', () => {
        ms('/project/:pid/task/:tid', 'symbolic')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a template type', () => {
        ms('/project/{pid}/task/{tid}', 'template')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a strict type', () => {
        ms('/project/', 'strict')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a static type', () => {
        ms('/project', 'static')
            .match('/foo')
            .should.be.false;
    });

    it('should return false for a non-match on a wildcard type', () => {
        ms('/project/*', 'wildcard')
            .match('/foo')
            .should.be.false;
    });

    it('should return flase for a non-match on a regexp type', () => {
        ms('^\/path\/$', 'regexp')
            .match('/foo')
            .should.be.false;
    });

    describe('with regex special characters in literal parts', () => {
        it('should handle template mode with regex choices and groups', () => {
            const pattern = ms('/api/items/{id}(.json|.xml)', 'template');
            pattern.match('/api/items/123.json').should.be.true;
            pattern.match('/api/items/abc.xml').should.be.true;
            pattern.match('/api/items/xyz.yaml').should.be.false;
            pattern.match('/api/items/123').should.be.false;
        });

        it('should handle symbolic mode with non-capturing group', () => {
            const pattern = ms('/user/:username/file(?:s?)', 'symbolic');
            pattern.match('/user/john/file').should.be.true;
            pattern.match('/user/jane/files').should.be.true;
            pattern.match('/user/doe/fileS').should.be.false; // Case-sensitive by default
        });

        it('should handle symbolic mode with non-capturing group and case-insensitivity', () => {
            const pattern = ms('/user/:username/file(?:s?)', 'symbolic', 'i');
            pattern.match('/user/doe/fileS').should.be.true; // Now true with 'i'
        });
    });
});
