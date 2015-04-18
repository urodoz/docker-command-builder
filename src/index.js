var puller = require("./puller"),
    builder = require("./builder"),
    runner = require("./runner");

module.exports =  function(type) {

    this.dockerVersion = 1.5;

    switch (type) {
        case "puller":
            return new puller(this.dockerVersion);
        case "runner":
            return new runner(this.dockerVersion);
        case "builder":
            return new builder(this.dockerVersion);
        default:
            throw Error("type '"+type+"' not supportd in docker-command-builder");
    }

}