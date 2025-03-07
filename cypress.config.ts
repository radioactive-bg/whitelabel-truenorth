// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:4000', // Update to match your environment
//     experimentalMemoryManagement: true, // Helps manage memory issues
//     numTestsKeptInMemory: 0, // Reduces memory usage
//     video: false, // Disables video recording to save resources
//     screenshotOnRunFailure: false, // Prevents unnecessary screenshots
//     defaultCommandTimeout: 10000, // Increases command timeout
//   },

//   viewportWidth: 1980,
//   viewportHeight: 1080,

//   component: {
//     devServer: {
//       framework: 'next',
//       bundler: 'webpack',
//     },
//   },
// });

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Local development
    experimentalMemoryManagement: true, // Helps manage memory issues
    numTestsKeptInMemory: 0, // Reduces memory usage
    video: false, // Disables video recording to save resources
    screenshotOnRunFailure: false, // Prevents unnecessary screenshots
    defaultCommandTimeout: 10000, // Increases command timeout

    // Environment variables for testing
    env: {
      // For dev environment testing (when needed)
      devUrl: 'https://dev.b2b.hksglobal.group',
      apiUrl: 'https://dev.b2b.hksglobal.group',
      basicAuth: {
        username: 'user',
        password: '7mCbeCHaWarbCgJO0e',
      },
    },

    // // Allows you to write setup code that executes before each test file
    // setupNodeEvents(on, config) {
    //   // Add any custom plugins or configuration here
    //   return config;
    // },
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
