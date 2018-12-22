module.exports = function(config) {
  const singleRun = process.env.KARMA_SINGLE_RUN !== "false";

  const ci = process.env.CI === "true";

  config.set({
    basePath: ".",
    frameworks: ["jasmine"],
    files: ["tests/dist/index.js"],
    autoWatch: true,

    browsers: ci ? ["ChromeHeadless", "sl_chrome_70"] : ["Chrome"],
    reporters: ci ? ["spec", "saucelabs"] : ["spec"],

    singleRun,

    // Max concurrency for SauceLabs OS plan
    concurrency: 5,

    // @see https://wiki.saucelabs.com/display/DOCS/Platform+Configurator/
    customLaunchers: {
      sl_chrome_35: {
        base: "SauceLabs",
        browserName: "chrome",
        platform: "Windows 7",
        version: "35"
      },
      sl_chrome_70: {
        base: "SauceLabs",
        browserName: "chrome",
        platform: "Windows 10",
        version: "70"
      }
    },
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
