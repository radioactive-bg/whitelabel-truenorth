import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ftbxmk', // Your Cypress project ID
  e2e: {
    // Use staging URL in CI, localhost in development
    baseUrl: process.env.CI
      ? 'https://proxy.duegate.com/staging'
      : 'http://localhost:3000',
    experimentalMemoryManagement: true, // Helps manage memory issues
    numTestsKeptInMemory: 0, // Reduces memory usage
    video: true, // Enable video recording for CI
    screenshotOnRunFailure: true, // Enable screenshots on failure
    defaultCommandTimeout: process.env.CI ? 10000 : 4000,
    pageLoadTimeout: process.env.CI ? 60000 : 30000,
    requestTimeout: process.env.CI ? 5000 : 5000,
    responseTimeout: process.env.CI ? 30000 : 30000,
    trashAssetsBeforeRuns: true,

    // Environment variables for testing
    env: {
      // For dev environment testing (when needed)
      devUrl: 'http://localhost:3000',
      // Always use staging URL for API calls
      apiUrl: 'https://proxy.duegate.com/staging',
      basicAuth: {
        username: 'user',
        password: '7mCbeCHaWarbCgJO0e',
      },
      CI: process.env.CI,
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
    },
  },

  viewportWidth: 1280,
  viewportHeight: 720,

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

  setupNodeEvents(on, config) {
    // Add retry configuration for CI
    if (process.env.CI) {
      config.retries = {
        runMode: 2,
        openMode: 0,
      };
    }

    return config;
  },
});
