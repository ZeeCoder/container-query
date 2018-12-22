const customLaunchers = {
  sl_chrome_35: {
    base: "SauceLabs",
    browserName: "Chrome",
    platform: "Windows 7",
    version: "35"
  },
  sl_chrome_70: {
    base: "SauceLabs",
    browserName: "Chrome",
    platform: "Windows 10",
    version: "70"
  },
  sl_edge_13: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    platform: "Windows 10",
    version: "13"
  },
  sl_ie_11: {
    // todo polyfill promises for the tests
    base: "SauceLabs",
    browserName: "Internet Explorer",
    platform: "Windows 10",
    version: "11"
  },
  sl_ff_30: {
    base: "SauceLabs",
    browserName: "Firefox",
    platform: "Windows 10",
    version: "30"
  },
  sl_ff_64: {
    base: "SauceLabs",
    browserName: "Firefox",
    platform: "Windows 10",
    version: "64"
  }
};

module.exports = function(config) {
  const singleRun = process.env.KARMA_SINGLE_RUN !== "false";
  const chrome = process.env.KARMA_CHROME === "true";
  const firefox = process.env.KARMA_FIREFOX === "true";
  const ci = process.env.CI === "true";

  const browsers = [];

  if (ci) {
    browsers.push(...Object.keys(customLaunchers));
  } else if (chrome) {
    browsers.push("Chrome");
  } else if (firefox) {
    browsers.push("Firefox");
  } else {
    browsers.push("ChromeHeadless");
  }

  config.set({
    basePath: ".",
    frameworks: ["jasmine"],
    files: ["tests/dist/index.js"],
    autoWatch: true,

    browsers,
    reporters: ci ? ["spec", "saucelabs"] : ["spec"],

    singleRun,

    // Max concurrency for SauceLabs OS plan
    concurrency: 5,

    // @see https://wiki.saucelabs.com/display/DOCS/Platform+Configurator/
    customLaunchers,
    sauceLabs: {
      testName: "@zeecoder/container-query",
      public: "public"
    },

    client: {
      jasmine: {
        // Order of the tests matter, so don't randomise it
        random: false
      }
    }
  });
};
