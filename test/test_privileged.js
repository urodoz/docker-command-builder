var dockerComm = require('./../src'),
    _ = require('lodash'),
    assert = require("assert");

describe('privileged flag', function() {

    it('simple privileged set', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("redis-container")
            .setImage("redis:2.8.17")
            .setPrivileged(true)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.equal('docker run -d --name=redis-container --privileged redis:2.8.17', command[1]);

        done();
    });

});