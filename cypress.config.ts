const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: '979hmh', // Your Cypress project ID
  e2e: {
    baseUrl: 'http://localhost:3000', // Local development
    experimentalMemoryManagement: true, // Helps manage memory issues
    numTestsKeptInMemory: 0, // Reduces memory usage
    video: true, // Enable video recording for CI
    screenshotOnRunFailure: true, // Enable screenshots on failure
    defaultCommandTimeout: 10000, // Increases command timeout

    // Environment variables for testing
    env: {
      // For dev environment testing (when needed)
      devUrl: 'https://dev.b2b.hksglobal.group',
      apiUrl: 'https://proxy.duegate.com/staging',
      basicAuth: {
        username: 'user',
        password: '7mCbeCHaWarbCgJO0e',
      },
    },
  },

  viewportWidth: 1980,
  viewportHeight: 1080,

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  retries: {
    runMode: 2,
    openMode: 0,
  },
});
