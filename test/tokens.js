'use strict';

const ms = require('../lib/matchstick.js');


describe('#tokens', () => {
    it('should properly tokenize a template', () => {
        ms('/project/{pid}/task/{tid}', 'template').tokens
            .should.eql([ 'pid', 'tid' ]);
    });

    it('should properly tokenize symbols', () => {
        ms('/project/:pid/task/:tid', 'symbolic').tokens
            .should.eql([ 'pid', 'tid' ]);
    });

    it('should properly tokenize consecutive symbols', () => {
        ms('/:project:id', 'symbolic').tokens
            .should.eql([ 'project', 'id' ]);
    });
});
