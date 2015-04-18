var dockerComm = require('./../src'),
    _ = require('lodash'),
    assert = require("assert");

describe('volumes', function() {

    it('registerig multiple volumes', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("redis-container")
            .setImage("redis:2.8.17")
            .addVolume("/tmp/workspace", "/opt/workspace")
            .addVolume("/home/folder", "/code", "ro")
            .setDaemon(true)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.equal(
            'docker run -d --name=redis-container -v /tmp/workspace:/opt/workspace -v /home/folder:/code:ro redis:2.8.17',
            command[1]
        );

        done();
    });

});