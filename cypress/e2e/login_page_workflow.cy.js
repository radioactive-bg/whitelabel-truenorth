// cypress/e2e/login.cy.js
describe('Login Page Tests', () => {
  // Common selectors
  const selectors = {
    loginForm: 'form',
    email: 'input[name="email"]',
    password: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    title: 'h2',
    dashboardTitle: 'h1',
    labels: 'label',
  };

  // Test data
  const testData = {
    validEmail: Cypress.env('TEST_EMAIL') || 'm.petkov2@radioactive.bg',
    validPassword: Cypress.env('TEST_PASSWORD') || 'm.petkov2@radioactive.bg',
    invalidEmail: 'invalid@example.com',
    invalidPassword: 'wrongpassword',
    testEmail: 'test@example.com',
    testPassword: 'password123',
  };

  // URLs and endpoints
  const endpoints = {
    loginEndpoint: '**/oauth/token',
    profileEndpoint: '**/distributor-crm/v1/profile',
    productGroupsEndpoint: '**/distributor-crm/v1/product-groups*',
  };

  // Helper functions
  function setupSuccessfulLoginIntercepts() {
    // Intercept login API with success response
    cy.intercept('POST', endpoints.loginEndpoint, {
      statusCode: 200,
      body: {
        access_token: 'fake_token',
        refresh_token: 'fake_refresh',
        expires_in: 3600,
      },
    }).as('loginRequest');

    // Intercept user profile API - setting is2FAEnable to false to skip OTP
    cy.intercept('GET', endpoints.profileEndpoint, {
      statusCode: 200,
      body: {
        is2FAEnable: false,
        // Other user profile fields
      },
    }).as('profileRequest');

    // Intercept product groups API call that happens in the dashboard
    cy.intercept('GET', endpoints.productGroupsEndpoint, {
      statusCode: 200,
      body: {
        1: 'Amazon',
        2: 'PlayStation Store',
        3: 'Google Play',
        4: 'Apple',
        5: 'Steam',
        6: 'Nintendo',
      },
    }).as('productGroupsRequest');
  }

  function verifyLocalStorage() {
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.equal('fake_token');
      expect(win.localStorage.getItem('refresh_token')).to.equal(
        'fake_refresh',
      );
      expect(win.localStorage.getItem('access_token_expires')).to.equal('3600');
    });
  }

  beforeEach(() => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Log environment variables for debugging
    cy.log('Environment Variables:', {
      frontendUrl: Cypress.env('frontendUrl'),
      apiUrl: Cypress.env('apiUrl'),
      CI: Cypress.env('CI'),
    });

    // Log the URLs for debugging
    cy.log(
      `Using URLs - Frontend: ${Cypress.env('frontendUrl')}, API: ${Cypress.env('apiUrl')}`,
    );

    // Visit the login page
    cy.visit('/login', {
      timeout: 30000,
      onBeforeLoad(win) {
        // Set the API URL in the window object
        win.CYPRESS_API_URL = Cypress.env('apiUrl');
      },
    });

    // Wait for the login form to be visible with increased timeout
    cy.get(selectors.loginForm, { timeout: 30000 }).should('be.visible');
  });

  const login = () => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Log environment variables for debugging
    cy.log('Environment Variables:', {
      frontendUrl: Cypress.env('frontendUrl'),
      apiUrl: Cypress.env('apiUrl'),
      CI: Cypress.env('CI'),
    });

    // Log the URLs for debugging
    cy.log(
      `Using URLs - Frontend: ${Cypress.env('frontendUrl')}, API: ${Cypress.env('apiUrl')}`,
    );

    // Visit the login page
    cy.visit('/login', {
      timeout: 30000,
      onBeforeLoad(win) {
        // Set the API URL in the window object
        win.CYPRESS_API_URL = Cypress.env('apiUrl');
      },
    });

    // Wait for the login form to be visible with increased timeout
    cy.get(selectors.loginForm, { timeout: 30000 }).should('be.visible');

    // Login with test credentials
    cy.get(selectors.email, { timeout: 30000 })
      .should('be.visible')
      .type(testData.validEmail);
    cy.get(selectors.password, { timeout: 30000 })
      .should('be.visible')
      .type(testData.validPassword);
    cy.get(selectors.submitButton, { timeout: 30000 })
      .should('be.visible')
      .click();

    // Wait for successful login and redirect with increased timeout
    cy.url().should('include', '/dashboard', { timeout: 30000 });

    // Add a small delay to ensure the dashboard is fully loaded
    cy.wait(3000);
  };

  it('should render the login page with all UI elements', () => {
    // Check for main title and form
    cy.get(selectors.title, { timeout: 30000 })
      .contains('Sign in to your account')
      .should('be.visible');

    // Check login form elements
    cy.get(selectors.labels, { timeout: 30000 })
      .contains('Email address')
      .should('be.visible');
    cy.get(selectors.email, { timeout: 30000 }).should('be.visible');
    cy.get(selectors.labels, { timeout: 30000 })
      .contains('Password')
      .should('be.visible');
    cy.get(selectors.password, { timeout: 30000 }).should('be.visible');
    cy.get(selectors.submitButton, { timeout: 30000 })
      .contains('Sign in')
      .should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Click sign in without entering any data
    cy.get(selectors.submitButton, { timeout: 30000 })
      .should('be.visible')
      .click();

    // Browser validation should prevent form submission for required fields
    // Check if the form wasn't submitted (we're still on login page)
    cy.url().should('include', '/login', { timeout: 30000 });

    // Check for HTML5 validation by verifying email input is invalid
    cy.get(`${selectors.email}:invalid`, { timeout: 30000 }).should('exist');
  });

  it('should show error message for invalid credentials', () => {
    // Intercept the login API call and mock a failed response
    cy.intercept('POST', endpoints.loginEndpoint, {
      statusCode: 401,
      body: {
        message: 'Invalid email or password',
      },
    }).as('loginFailedRequest');

    // Fill in invalid credentials
    cy.get(selectors.email, { timeout: 30000 })
      .should('be.visible')
      .type(testData.invalidEmail);
    cy.get(selectors.password, { timeout: 30000 })
      .should('be.visible')
      .type(testData.invalidPassword);
    cy.get(selectors.submitButton, { timeout: 30000 })
      .should('be.visible')
      .click();

    // Wait for the API call
    cy.wait('@loginFailedRequest', { timeout: 30000 });

    // Check for error message (from alert in your handleLogin function)
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Failed to login');
    });
  });

  it('should login successfully, redirect to dashboard, and display dashboard content', () => {
    // Setup API intercepts for successful login flow
    setupSuccessfulLoginIntercepts();

    // Fill in valid credentials
    cy.get(selectors.email, { timeout: 30000 })
      .should('be.visible')
      .type(testData.validEmail);
    cy.get(selectors.password, { timeout: 30000 })
      .should('be.visible')
      .type(testData.validPassword);
    cy.get(selectors.submitButton, { timeout: 30000 })
      .should('be.visible')
      .click();

    // Wait for the login API call
    cy.wait('@loginRequest', { timeout: 30000 });

    // Verify redirection to dashboard
    cy.url().should('include', '/dashboard', { timeout: 30000 });

    // Wait for the page to be fully loaded
    cy.get('body', { timeout: 30000 }).should('be.visible');

    // Verify dashboard content is loaded correctly
    cy.get(selectors.dashboardTitle, { timeout: 30000 })
      .contains('Find the Perfect Gift Card')
      .should('be.visible');
    cy.contains('Browse our wide selection of gift cards for any occasion', {
      timeout: 30000,
    }).should('be.visible');
    cy.get('a', { timeout: 30000 })
      .contains('Browse Gift Cards')
      .should('be.visible');

    // Verify local storage was updated with the token
    verifyLocalStorage();
  });

  it('should update form values when typing', () => {
    // Test the controlled inputs
    cy.get(selectors.email, { timeout: 30000 })
      .should('be.visible')
      .type(testData.testEmail)
      .should('have.value', testData.testEmail);

    cy.get(selectors.password, { timeout: 30000 })
      .should('be.visible')
      .type(testData.testPassword)
      .should('have.value', testData.testPassword);
  });
});
