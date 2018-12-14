module.exports = function(config) {
  config.set({
    basePath: ".",
    frameworks: ["jasmine"],
    files: ["browser-tests/dist/index.js"],
    autoWatch: true,
    browsers: ["Chrome"],
    // browsers: process.env.CI ? Object.keys(customLaunchers) : ['Chrome'],

    singleRun: true,

    concurrency: 2 // SanceLabs free account for open source

    // customLaunchers: customLaunchers,

    // Saucelabs launcher
    // sauceLabs: {
    //   testName: 'react-container-query',
    //   public: 'public'
    // },
  });
};
