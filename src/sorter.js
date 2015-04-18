var S = require("string"),
    _ = require("lodash");

/**
 * Orders the array command as follows
 *
 * - pull items
 * - build items
 * - run items
 *
 * @param commandArray
 */
module.exports = function(commandArray) {

    var pullPackage = [],
        buildPackage = [],
        runPackage = [];

    commandArray.forEach(function(command) {
        if(S(command).startsWith("docker pull")) pullPackage.push(command);
        if(S(command).startsWith("docker build")) buildPackage.push(command);
        if(S(command).startsWith("docker run")) runPackage.push(command);
    });

    return _.union(pullPackage, _.union(buildPackage, runPackage));
};