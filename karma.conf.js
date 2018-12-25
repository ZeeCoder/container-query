// @see https://wiki.saucelabs.com/display/DOCS/Platform+Configurator/
const customLaunchers = {
  // disabled, as ios tests proved to be unreliable
  // sl_iphone_6s: {
  //   base: "SauceLabs",
  //   browserName: "Safari",
  //   platform: "iOS",
  //   deviceName: "iPhone 6s Simulator",
  //   deviceOrientation: "portrait",
  //   platformVersion: "10.0"
  // },
  // sl_iphone_x: {
  //   base: "SauceLabs",
  //   browserName: "Safari",
  //   platform: "iOS",
  //   deviceName: "iPhone XS Simulator",
  //   deviceOrientation: "portrait",
  //   platformVersion: "12.0"
  // },
  sl_android_4_4: {
    base: "SauceLabs",
    browserName: "Chrome",
    platform: "Android",
    version: "4.4",
    deviceName: "Android Emulator",
    deviceOrientation: "portrait"
  },
  sl_android_6: {
    base: "SauceLabs",
    browserName: "Chrome",
    platform: "Android",
    version: "6.0",
    deviceName: "Android Emulator",
    deviceOrientation: "portrait"
  },
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
  // Testing the oldest edge version
  sl_edge_13: {
    base: "SauceLabs",
    browserName: "MicrosoftEdge",
    platform: "Windows 10",
    version: "13"
  },
  sl_ie_11: {
    base: "SauceLabs",
    browserName: "Internet Explorer",
    platform: "Windows 10",
    version: "11"
  },
  sl_ie_10: {
    base: "SauceLabs",
    browserName: "Internet Explorer",
    platform: "Windows 7",
    version: "10"
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
    },

    // SauceLabs takes some time to connect to mobile devices
    captureTimeout: 120000
  });
};
