var dockerComm = require('./../src'),
    S = require('string'),
    _ = require('lodash'),
    assert = require("assert");

describe('pull', function() {

    it('pulling image from docker registry', function(done) {
        var pullerBuilder = dockerComm("puller");
        pullerBuilder.setImage("redis");
        pullerBuilder.setVersion("2.8.17");
        var command = pullerBuilder.make();

        assert.equal(command, 'docker pull redis:2.8.17');
        done();
    });

    it('pulling image from custom registry', function(done) {
        var pullerBuilder = dockerComm("puller");
        pullerBuilder.setImage("image1");
        pullerBuilder.setRegistry("registry.custom.server.com");
        pullerBuilder.setVersion("1.1.1");
        var command = pullerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(1, command.length);
        assert.equal(command[0], 'docker pull registry.custom.server.com/image1:1.1.1');
        done();
    });

});