var dockerComm = require('./../src'),
    _ = require('lodash'),
    assert = require("assert");

describe('version', function() {

    it('init with version', function(done) {
        var runnerBuilder = dockerComm("runner", 1.3);
        assert.equal(1.3, runnerBuilder.dockerVersion);
        done();
    });

    it('default latest supported version', function(done) {
        var runnerBuilder = dockerComm("runner");
        assert.equal(1.6, runnerBuilder.dockerVersion);
        done();
    });

});