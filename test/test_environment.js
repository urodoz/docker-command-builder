var dockerComm = require('./../src'),
    _ = require('lodash'),
    assert = require("assert");

describe('environment variables', function() {

    it('registerig multiple environment variables', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("redis-container")
            .setImage("redis:2.8.17")
            .addEnvironmentVariable("deep", "purple")
            .addEnvironmentVariable("deep", "purple2")
            .setDaemon(true)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.equal('docker run -d --name=redis-container -e "deep=purple" -e "deep=purple2" redis:2.8.17', command[1]);

        done();
    });

});