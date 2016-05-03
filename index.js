"use strict";

var fs = require("fs");
var semver = require("semver");
var yaml = require("js-yaml");

var cache;

exports.clearCache = function clearCache () { cache = null };

exports.detectBuild = function detectBuild () {
  var config = exports.loadConfig();

  return semver.gte(process.version, config.minCurNodeVer) ? "current"
       : !config.shimCheck || global[config.shimCheck] ? "legacy"
       : "legacy-shim";
};

exports.loadConfig = function loadConfig (reload) {
  if (cache && !reload) return cache;

  cache = yaml.safeLoad(fs.readFileSync(".titorrc", "utf8"));

  if (typeof cache !== "object") throw Error("Invalid .titorrc");

  if (!semver.valid(cache.minCurNodeVer))
    throw Error("Invalid or missing minCurNodeVer in .titorrc");

  if (typeof cache.export !== "string")
    throw Error("Invalid or missing export in .titorrc");

  return cache;
};
