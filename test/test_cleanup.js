var dockerComm = require('./../src'),
    _ = require('lodash'),
    assert = require("assert");

describe('clean up flag', function() {

    it('clean up', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("redis-container")
            .setImage("redis:2.8.17")
            .setCleanUp(true)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.equal('docker run --rm --name=redis-container redis:2.8.17', command[1]);

        done();
    });

});