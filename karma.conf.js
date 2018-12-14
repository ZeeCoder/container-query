module.exports = function(config) {
  config.set({
    basePath: ".",
    frameworks: ["jasmine"],
    files: ["browser-tests/dist/index.js"],
    autoWatch: true,

    // todo come up with a way to switch in between dev / CI setup
    // browsers: ["Chrome"],
    // reporters: ["spec"],

    reporters: ["spec", "saucelabs"],
    browsers: ["sl_chrome_70"],

    singleRun: true,

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

    // Saucelabs launcher
    // sauceLabs: {
    //   testName: 'react-container-query',
    //   public: 'public'
    // },
    sauceLabs: {
      testName: "@zeecoder/container-query",
      public: "public"
    }
  });
};
