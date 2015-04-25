var _ = require("lodash"),
    uuid = require("node-uuid"),
    Mustache = require("mustache"),
    sorter = require('./sorter'),
    builder = require("./builder"),
    puller = require("./puller");

module.exports = function(dockerVersion) {

    this.remoteImage = true;
    this.template = null;
    this.dockerVersion = dockerVersion;
    this.name = uuid.v4(); //Initial random name

    this.image = null;
    this.builder = null;

    this.daemon = true;
    this.privileged = false;
    this.cleanUp = false;
    this.alias = null;
    this.ports = [];
    this._links = [];
    this.children = [];
    this.environmentVariables = [];
    this.volumes = [];

    this.setBuild = function(tag, dir) {
        this.image = tag;
        this.builder = new builder();
        this.builder.setTag(tag);
        this.builder.setDir(dir);
        return this;
    };

    this.setCleanUp = function(flag) {
        this.cleanUp = flag;
        if(flag===true) this.daemon = false;
        return this;
    };

    /**
     * Sets the boolean value for privileged
     *
     * @param flag {boolean}
     * @returns {runner}
     */
    this.setPrivileged = function(flag) {
        this.privileged = flag;
        return this;
    };

    this.setAlias = function(alias) {
        this.alias = alias;
        return this;
    };

    this.getAlias = function() {
        return this.alias;
    };

    this.addPort = function(portDescription) {
        this.ports.push(" -p "+portDescription);
        return this;
    };

    this.addChild = function(child) {
        this.children.push(child);
        return this;
    };

    this._addLink = function(linkDescription) {
        this._links.push(" --link "+linkDescription);
        return this;
    };

    this.setDaemon = function(flag) {
        this.daemon = flag;
        if(flag===true) this.cleanUp = false;
        return this;
    };

    this.setName = function(name) {
        this.name = name;
        return this;
    };

    this.getName = function() {
        return this.name;
    };

    this.setImage = function(image) {
        this.image = image;
        this.builder = null;
        return this;
    };

    this.getImage = function() {
        return this.image;
    };

    this.addEnvironmentVariable = function(key, value) {
        this.environmentVariables.push(key+'='+value);
        return this;
    };

    this.addVolume = function(hostDir, containerDir, mode) {
        if(typeof(mode)=="undefined") mode = "";
        var rMode = "";
        switch (mode) {
            case "rw":
                rMode = ":rw";
                break;
            case "ro":
                rMode = ":ro";
                break;
        }

        this.volumes.push(hostDir+":"+containerDir+rMode);
        return this;
    };

    this.initTemplate = function() {
        this.template = "docker run {{#daemon}}{{daemon}}{{/daemon}}"+
            "{{#cleanUp}}{{cleanUp}}{{/cleanUp}}"+
            " --name={{&name}}"+
            "{{#privileged}} {{&privileged}}{{/privileged}}"+
            "{{#ports}}{{&ports}}{{/ports}}"+
            "{{#links}}{{&links}}{{/links}}"+
            '{{#environmentVariables}} -e "{{{.}}}"{{/environmentVariables}}'+
            '{{#volumes}} -v {{{.}}}{{/volumes}}'+
            " {{&image}}"
            ;
    };

    //init the object
    this.initTemplate();

    this._extractAliasFromImage = function(image) {
        image = image.split(":")[0];
        image = image.split("/")[0];
        return image;
    };

    this.make = function() {

        //Adding child commands
        var commands = [];
        this.children.forEach(function(child) {
            var alias = child.getAlias();
            if(_.isNull(alias)) alias = this._extractAliasFromImage(child.getImage());

            this._addLink(child.getName()+":"+alias);

            var childCommands = child.make();
            childCommands.forEach(function(ccmd) {
                commands.push(ccmd);
            });
        }, this);

        //Adding build step if necessary
        if(!_.isEmpty(this.builder)) {
            commands.push(_.first(this.builder.make()));
        } else {
            //Generating pulling information
            var pullerBuilder = new puller(this.dockerVersion);
            pullerBuilder.setImage(this.image);
            commands.push(_.first(pullerBuilder.make()));
        }

        //Generating running command
        var templateObject = {
            daemon: (this.daemon) ? '-d' : '',
            cleanUp: (this.cleanUp) ? '--rm' : '',
            privileged: (this.privileged) ? '--privileged' : '',
            image: this.image,
            name: this.name,
            links: (_.isEmpty(this._links)) ? false : this._links.join(" "),
            ports: (_.isEmpty(this.ports)) ? false : this.ports.join(" "),
            environmentVariables: this.environmentVariables,
            volumes: this.volumes
        };
        commands.push(Mustache.render(this.template, templateObject));

        return sorter(_.uniq(commands));
    };

};