"use strict";

var chai = require("chai");
var sh = require("shelljs");
var util = require("..");

var expect = chai.expect;

describe("index.js", function () {
  afterEach(function () {
    if (sh.test("-e", ".titorrc")) sh.rm(".titorrc");
  });

  beforeEach(function () {
    util.clearCache();
    sh.cp("test/resource/current.titorrc", ".titorrc");
  });

  describe(".clearCache", function () {
    it("should reset config so it can be reloaded from file", function () {
      var config = util.loadConfig();

      util.clearCache();

      expect(util.loadConfig()).to.not.equal(config);
    });
  });

  describe(".detectBuild", function () {
    it("should, if minCurNodeVer is lower than node version, return 'current'",
    function () {
      expect(util.detectBuild()).to.equal("current");
    });

    it("should, if minCurNodeVer is higher than node version and no shimCheck,"
     + " return 'legacy'", function () {
      sh.cp("test/resource/legacy-no-shim-check.titorrc", ".titorrc");

      expect(util.detectBuild()).to.equal("legacy");
    });

    it("should, if minCurNodeVer is higher than node version and shimCheck,"
     + " passed, return 'legacy'", function () {
      sh.cp("test/resource/legacy-shim-check-pass.titorrc", ".titorrc");

      expect(util.detectBuild()).to.equal("legacy");
    });

    it("should, if minCurNodeVer is higher than node version and shimCheck"
     + " fails, return 'legacy-shim'", function () {
      sh.cp("test/resource/legacy-shim-check-fail.titorrc", ".titorrc");

      expect(util.detectBuild()).to.equal("legacy-shim");
    });
  });

  describe(".loadConfig", function () {
    it("should return a config object", function () {
      expect(util.loadConfig()).to.be.an("object").with.property("mainExport");
    });

    it("should return the same object if called multiple times", function () {
      expect(util.loadConfig()).to.equal(util.loadConfig());
    });

    it("should throw if no .titorrc", function () {
      sh.rm(".titorrc");

      expect(util.loadConfig).to.throw(/no such file/);
    });

    it("should throw if invalid .titorrc", function () {
      sh.cp("test/resource/bad.titorrc", ".titorrc");

      expect(util.loadConfig).to.throw("Invalid .titorrc");
    });
  });
});
