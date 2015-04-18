var _ = require("lodash"),
    Mustache = require("mustache");

module.exports = function(dockerVersion) {

    this.template = "docker build -t {{&tag}} {{&dir}}";

    this.dockerVersion = dockerVersion;
    this.tag = null;
    this.dir = null;

    this.setTag = function(tag) {
        this.tag = tag;
        return this;
    };

    this.setDir = function(dir) {
        this.dir = dir;
    };

    this.make = function() {
        if (_.isEmpty(this.tag) || _.isEmpty(this.dir)) throw Error("Tag/Dir not defined on builder");
        return [Mustache.render(this.template, this)];
    };

};