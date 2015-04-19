# Docker Command Builder

Docker command generator that take cares of container dependencies

#### Build status

[![Build Status](https://travis-ci.org/urodoz/docker-command-builder.svg?branch=master)](https://travis-ci.org/urodoz/docker-command-builder)

## Installation

Use NPM to install the library:

```bash
npm install docker-command-builder
```
    
## Usage

You can use the runner component to create dependant containers:

```javascript
dockerComm = require("docker-command-builder");

var runnerBuilderChild = dockerComm("runner");
runnerBuilderChild
    .setName("selenium-named-chrome")
    .setImage("selenium-node-chrome:2.45.0")
    .setAlias("chrome")
    .setDaemon(true);
    
var runnerBuilder = dockerComm("runner");
    
runnerBuilder
    .setName("hub")
    .setImage("selenium-hub:2.45.0")
    .setDaemon(true)
    .addChild(runnerBuilderChild);
        
var runnerBuilderApp = dockerComm("runner");
    
runnerBuilderApp
    .setName("hub")
    .setImage("custom-application:1.0.0")
    .setDaemon(true)
    .addChild(runnerBuilder);
    
var command = runnerBuilderApp.make();
console.log(command)
```

Will output te next array :

    [
        'docker pull selenium-node-chrome:2.45.0',
        'docker pull selenium-hub:2.45.0',
        'docker pull custom-application:1.0.0',
        'docker run -d --name=selenium-named-chrome selenium-node-chrome:2.45.0',
        'docker run -d --name=hub --link selenium-named-chrome:chrome selenium-hub:2.45.0',
        'docker run -d --name=hub --link hub:selenium-hub custom-application:1.0.0'
    ]
    
You can set build folder and tag, environment variables, volumes, etc...

## API

### puller

Exposed by:

```javascript
require("docker-command-builder")("puller")
```

#### puller#setImage(image)

Sets the name of the image for the pull command

#### puller#setRegistry(registry)

By default is setted to null (the official docker registry), you can change it on this variable

```javascript
var pullerBuilder = dockerComm("puller");
pullerBuilder.setImage("image1");
pullerBuilder.setRegistry("registry.custom.server.com");
pullerBuilder.setVersion("1.1.1");
var command = pullerBuilder.make();

console.log(command);
//--> docker pull registry.custom.server.com/image1:1.1.1
```

#### puller#make

Generates the command array

### builder

Exposed by ```require("docker-command-builder")("builder")```

#### builder#setTag(tag)

Sets the tag of the build

#### builder#setDir(dir)

Sets the dir of the build. Must be absolute path

#### builder#make

Generates the command array

### runner

Exposed by ```require("docker-command-builder")("runner")```

#### runner#setBuild(tag,dir)

Disables the image option, and sets the build tag as image of the run

#### runner#setAlias(alias)

If setted, instead the name of the image to generate the link on parent containers, will use the alias

#### runner#getAlias

Returns the alias

#### runner#addPort

Add a port definition as ```127.0.0.1:8000:80```

#### runner#addChild(runner instance)

Add a runner instance as child container

#### runner#setDaemon(boolean flag)

Sets the run command as daemon or not (by default is ```true```). If enabled, disables the cleanUp flag.

#### runner#setCleanUp(boolean flag)

Sets the container flag for clean up (--rm). If enabled, disables the daemon flag.

#### runner#setImage(image)

Sets the image of the command. Disabled the build information

#### runner#getImage

Returns the image setted.

#### runner#addEnvironmentVariable(key,value)

Adds a new environment variable to the container

#### runner#addVolume(hostDir,containerDir,mode=rw|ro[optional])

Adds a new volume to the container. Mode by default is empty

#### runner#make

Generates the command array

## TODO

* Add runtime constraints to runner (memory and cpu)
* Add privileged flag
* Add user option to runner
* Add workdir option to runner
* Add command option to runner

## LICENSE 

MIT
