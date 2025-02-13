const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Update to match your environment
    experimentalMemoryManagement: true, // Helps manage memory issues
    numTestsKeptInMemory: 0, // Reduces memory usage
    video: false, // Disables video recording to save resources
    screenshotOnRunFailure: false, // Prevents unnecessary screenshots
    defaultCommandTimeout: 10000, // Increases command timeout
  },

  viewportWidth: 1980,
  viewportHeight: 1080,

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
