import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ftbxmk', // Your Cypress project ID
  e2e: {
    // Always use localhost for frontend navigation
    baseUrl: 'http://localhost:3000',
    experimentalMemoryManagement: true, // Helps manage memory issues
    numTestsKeptInMemory: 0, // Reduces memory usage
    video: true, // Enable video recording for CI
    screenshotOnRunFailure: true, // Enable screenshots on failure
    defaultCommandTimeout: process.env.CI ? 30000 : 4000,
    pageLoadTimeout: process.env.CI ? 60000 : 30000,
    requestTimeout: process.env.CI ? 30000 : 5000,
    responseTimeout: process.env.CI ? 30000 : 30000,
    trashAssetsBeforeRuns: true,

    // Environment variables for testing
    env: {
      // Frontend URL
      frontendUrl: 'http://localhost:3000',
      // API URL
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

    // Log the URLs and environment for debugging
    console.log('Environment:', {
      CI: process.env.CI,
      frontendUrl: config.env.frontendUrl,
      apiUrl: config.env.apiUrl,
      baseUrl: config.baseUrl,
    });

    return config;
  },
});
