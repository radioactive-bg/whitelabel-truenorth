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
    validEmail: 'm.petkov2@radioactive.bg',
    validPassword: 'm.petkov2@radioactive.bg',
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

  const login = () => {
    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

    // Wait for the login form to be visible
    cy.get(selectors.loginForm).should('be.visible');

    // Login with test credentials
    cy.get(selectors.email).type(testData.validEmail);
    cy.get(selectors.password).type(testData.validPassword);
    cy.get(selectors.submitButton).click();

    // Wait for successful login and redirect
    cy.url().should('include', '/dashboard');

    // Add a small delay to ensure the dashboard is fully loaded
    cy.wait(2000);
  };

  beforeEach(() => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

    // Wait for the login form to be visible
    cy.get(selectors.loginForm).should('be.visible');
  });

  it('should render the login page with all UI elements', () => {
    // Check for main title and form
    cy.get(selectors.title).contains('Sign in to your account').should('exist');

    // Check login form elements
    cy.get(selectors.labels).contains('Email address').should('exist');
    cy.get(selectors.email).should('exist');
    cy.get(selectors.labels).contains('Password').should('exist');
    cy.get(selectors.password).should('exist');
    cy.get(selectors.submitButton).contains('Sign in').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    // Click sign in without entering any data
    cy.get(selectors.submitButton).click();

    // Browser validation should prevent form submission for required fields
    // Check if the form wasn't submitted (we're still on login page)
    cy.url().should('include', '/login');

    // Check for HTML5 validation by verifying email input is invalid
    cy.get(`${selectors.email}:invalid`).should('exist');
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
    cy.get(selectors.email).type(testData.invalidEmail);
    cy.get(selectors.password).type(testData.invalidPassword);
    cy.get(selectors.submitButton).click();

    // Wait for the API call
    cy.wait('@loginFailedRequest');

    // Check for error message (from alert in your handleLogin function)
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Failed to login');
    });
  });

  it('should login successfully, redirect to dashboard, and display dashboard content', () => {
    // Setup API intercepts for successful login flow
    setupSuccessfulLoginIntercepts();

    // Fill in valid credentials
    cy.get(selectors.email).type(testData.validEmail);
    cy.get(selectors.password).type(testData.validPassword);
    cy.get(selectors.submitButton).click();

    // Wait for the login API call
    cy.wait('@loginRequest');

    // Verify redirection to dashboard
    cy.url().should('include', '/dashboard');

    // Wait for the page to be fully loaded
    cy.get('body').should('be.visible');

    // Verify dashboard content is loaded correctly
    cy.get(selectors.dashboardTitle)
      .contains('Find the Perfect Gift Card')
      .should('be.visible');
    cy.contains(
      'Browse our wide selection of gift cards for any occasion',
    ).should('be.visible');
    cy.get('a').contains('Browse Gift Cards').should('be.visible');

    // Verify local storage was updated with the token
    verifyLocalStorage();
  });

  it('should update form values when typing', () => {
    // Test the controlled inputs
    cy.get(selectors.email)
      .type(testData.testEmail)
      .should('have.value', testData.testEmail);

    cy.get(selectors.password)
      .type(testData.testPassword)
      .should('have.value', testData.testPassword);
  });
});
