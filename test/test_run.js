var dockerComm = require('./../src'),
    S = require('string'),
    _ = require('lodash'),
    assert = require("assert");

describe('run', function() {

    it('simple named run', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("redis-container")
            .setImage("redis:2.8.17")
            .setDaemon(true)
            ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.equal("docker run -d --name=redis-container redis:2.8.17", command[1]);

        done();
    });

    it('simple unnamed run', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setImage("redis:2.8.17")
            .setDaemon(true)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.ok(/^docker run -d --name=[a-zA-Z0-9\-]+ redis:2.8.17$/.test(command[1]));

        done();
    });

    it('simple named run with ports', function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setImage("redis:2.8.17")
            .setDaemon(true)
            .addPort('127.0.0.1:8000:8000');
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker pull redis:2.8.17", command[0]);
        assert.ok(/^docker run -d.*redis:2.8.17$/.test(command[1]));
        assert.ok(S(command[1]).contains("-p 127.0.0.1:8000:8000"));

        done();
    });

    it("run with build step", function(done) {
        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setDaemon(true)
            .setBuild("node1", "/home/urodoz/workspace/node1")
            .addPort('127.0.0.1:8000:8000');
        ;

        var command = runnerBuilder.make();
        assert.ok(_.isArray(command));
        assert.equal(2, command.length);
        assert.equal("docker build -t node1 /home/urodoz/workspace/node1", command[0]);
        assert.ok(/^docker run -d.*node1$/.test(command[1]));

        done();
    });

});