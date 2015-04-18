var dockerComm = require('./../src'),
    S = require('string'),
    _ = require('lodash'),
    assert = require("assert");

describe('run with dependencies', function() {

    it('run with linked container', function(done) {

        var runnerBuilderChild = dockerComm("runner");
        runnerBuilderChild
            .setName("selenium-named-chrome")
            .setImage("selenium-node-chrome:2.45.0")
            .setDaemon(true)
        ;

        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("hub")
            .setImage("selenium-hub:2.45.0")
            .setDaemon(true)
            .addChild(runnerBuilderChild)
            ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(4, command.length);
        assert.equal('docker pull selenium-node-chrome:2.45.0', command[0]); //Pulling dependency
        assert.equal('docker pull selenium-hub:2.45.0', command[1]);
        assert.equal('docker run -d --name=selenium-named-chrome selenium-node-chrome:2.45.0', command[2]);
        assert.equal('docker run -d --name=hub --link selenium-named-chrome:selenium-node-chrome selenium-hub:2.45.0', command[3]);

        done();
    });

    it('aliased dependency', function(done) {
        var runnerBuilderChild = dockerComm("runner");
        runnerBuilderChild
            .setName("selenium-named-chrome")
            .setImage("selenium-node-chrome:2.45.0")
            .setAlias("chrome")
            .setDaemon(true)
        ;

        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("hub")
            .setImage("selenium-hub:2.45.0")
            .setDaemon(true)
            .addChild(runnerBuilderChild)
        ;

        var command = runnerBuilder.make();

        assert.ok(_.isArray(command));
        assert.equal(4, command.length);
        assert.equal('docker pull selenium-node-chrome:2.45.0', command[0]); //Pulling dependency
        assert.equal('docker pull selenium-hub:2.45.0', command[1]);
        assert.equal('docker run -d --name=selenium-named-chrome selenium-node-chrome:2.45.0', command[2]);
        assert.equal('docker run -d --name=hub --link selenium-named-chrome:chrome selenium-hub:2.45.0', command[3]);

        done();
    });

    it("recursive dependency", function(done) {
        var runnerBuilderChild = dockerComm("runner");
        runnerBuilderChild
            .setName("selenium-named-chrome")
            .setImage("selenium-node-chrome:2.45.0")
            .setAlias("chrome")
            .setDaemon(true)
        ;

        var runnerBuilder = dockerComm("runner");

        runnerBuilder
            .setName("hub")
            .setImage("selenium-hub:2.45.0")
            .setDaemon(true)
            .addChild(runnerBuilderChild)
        ;

        var runnerBuilderApp = dockerComm("runner");

        runnerBuilderApp
            .setName("hub")
            .setImage("custom-application:1.0.0")
            .setDaemon(true)
            .addChild(runnerBuilder)
        ;

        var command = runnerBuilderApp.make();

        assert.ok(_.isArray(command));
        assert.equal(6, command.length);
        assert.equal('docker pull selenium-node-chrome:2.45.0', command[0]); //Pulling dependency
        assert.equal('docker pull selenium-hub:2.45.0', command[1]);
        assert.equal('docker pull custom-application:1.0.0', command[2]);
        assert.equal('docker run -d --name=selenium-named-chrome selenium-node-chrome:2.45.0', command[3]);
        assert.equal('docker run -d --name=hub --link selenium-named-chrome:chrome selenium-hub:2.45.0', command[4]);
        assert.equal('docker run -d --name=hub --link hub:selenium-hub custom-application:1.0.0', command[5]);

        done();
    });

});