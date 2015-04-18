var _ = require("lodash"),
    Mustache = require("mustache");

module.exports = function(dockerVersion) {

    this.template = "docker pull {{#registry}}{{&registry}}/{{/registry}}{{&image}}{{#version}}:{{&version}}{{/version}}";

    this.dockerVersion = dockerVersion;
    this.image = null;
    this.version = null;
    this.registry = null;

    this.setRegistry = function(registry) {
        this.registry = registry;
        return this;
    };

    this.setImage = function(image) {
        this.image = image;
        return this;
    };

    this.setVersion = function(version) {
        this.version = version;
        return this;
    };

    this.make = function() {
        if (_.isEmpty(this.image)) throw Error("Image not defined on puller");
        return [Mustache.render(this.template, this)];
    };

};