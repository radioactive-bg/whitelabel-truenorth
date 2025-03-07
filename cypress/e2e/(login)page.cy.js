// // cypress/e2e/login.cy.js
// describe('Login Page Tests', () => {
//   beforeEach(() => {
//     // Visit the login page with basic auth
//     cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');
//   });

//   it('should render the login page with all UI elements', () => {
//     // Check for main title and form
//     cy.get('h2').contains('Sign in to your account').should('exist');

//     // Check login form elements
//     cy.get('label').contains('Email address').should('exist');
//     cy.get('input[name="email"]').should('exist');
//     cy.get('label').contains('Password').should('exist');
//     cy.get('input[name="password"]').should('exist');
//     cy.get('button[type="submit"]').contains('Sign in').should('exist');
//   });

//   it('should show validation errors for empty fields', () => {
//     // Click sign in without entering any data
//     cy.get('button[type="submit"]').click();

//     // Browser validation should prevent form submission for required fields
//     // Check if the form wasn't submitted (we're still on login page)
//     cy.url().should('include', '/login');

//     // Check for HTML5 validation by verifying email input is invalid
//     cy.get('input[name="email"]:invalid').should('exist');
//   });

//   it('should show error message for invalid credentials', () => {
//     // Intercept the login API call and mock a failed response
//     cy.intercept('POST', '**/oauth/token', {
//       statusCode: 401,
//       body: {
//         message: 'Invalid email or password',
//       },
//     }).as('loginFailedRequest');

//     // Fill in invalid credentials
//     cy.get('input[name="email"]').type('invalid@example.com');
//     cy.get('input[name="password"]').type('wrongpassword');
//     cy.get('button[type="submit"]').click();

//     // Wait for the API call
//     cy.wait('@loginFailedRequest');

//     // Check for error message (from alert in your handleLogin function)
//     cy.on('window:alert', (text) => {
//       expect(text).to.equal('Failed to login');
//     });
//   });

//   it('should login successfully and redirect to dashboard', () => {
//     // Skip OTP verification by mocking necessary API responses

//     // Intercept login API with success response
//     cy.intercept('POST', '**/oauth/token', {
//       statusCode: 200,
//       body: {
//         access_token: 'fake_token',
//         refresh_token: 'fake_refresh',
//         expires_in: 3600,
//       },
//     }).as('loginRequest');

//     // Intercept user profile API - setting is2FAEnable to false to skip OTP
//     cy.intercept('GET', '**/distributor-crm/v1/profile', {
//       statusCode: 200,
//       body: {
//         is2FAEnable: false,
//         // Other user profile fields
//       },
//     }).as('profileRequest');

//     // Force redirect to dashboard after login (bypassing OTP/QR flow)
//     cy.intercept('GET', '**/dashboard*', (req) => {
//       req.continue();
//     }).as('dashboardRequest');

//     // Fill in valid credentials
//     cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
//     cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
//     cy.get('button[type="submit"]').click();

//     // Wait for the API calls
//     cy.wait('@loginRequest');

//     // Verify redirection to dashboard
//     cy.url().should('include', '/dashboard');
//   });

//   it('should update form values when typing', () => {
//     // Test the controlled inputs
//     const testEmail = 'test@example.com';
//     const testPassword = 'password123';

//     cy.get('input[name="email"]')
//       .type(testEmail)
//       .should('have.value', testEmail);
//     cy.get('input[name="password"]')
//       .type(testPassword)
//       .should('have.value', testPassword);
//   });
// });

// cypress/e2e/login.cy.js

describe('Login Page Tests', () => {
  beforeEach(() => {
    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');
  });

  it('should render the login page with all UI elements', () => {
    // Check for main title and form
    cy.get('h2').contains('Sign in to your account').should('exist');

    // Check login form elements
    cy.get('label').contains('Email address').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('label').contains('Password').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Sign in').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    // Click sign in without entering any data
    cy.get('button[type="submit"]').click();

    // Browser validation should prevent form submission for required fields
    // Check if the form wasn't submitted (we're still on login page)
    cy.url().should('include', '/login');

    // Check for HTML5 validation by verifying email input is invalid
    cy.get('input[name="email"]:invalid').should('exist');
  });

  it('should show error message for invalid credentials', () => {
    // Intercept the login API call and mock a failed response
    cy.intercept('POST', '**/oauth/token', {
      statusCode: 401,
      body: {
        message: 'Invalid email or password',
      },
    }).as('loginFailedRequest');

    // Fill in invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Wait for the API call
    cy.wait('@loginFailedRequest');

    // Check for error message (from alert in your handleLogin function)
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Failed to login');
    });
  });

  it('should login successfully, redirect to dashboard, and display dashboard content', () => {
    // Skip OTP verification by mocking necessary API responses

    // Intercept login API with success response
    cy.intercept('POST', '**/oauth/token', {
      statusCode: 200,
      body: {
        access_token: 'fake_token',
        refresh_token: 'fake_refresh',
        expires_in: 3600,
      },
    }).as('loginRequest');

    // Intercept user profile API - setting is2FAEnable to false to skip OTP
    cy.intercept('GET', '**/distributor-crm/v1/profile', {
      statusCode: 200,
      body: {
        is2FAEnable: false,
        // Other user profile fields
      },
    }).as('profileRequest');

    // Intercept product groups API call that happens in the dashboard
    cy.intercept('GET', '**/distributor-crm/v1/product-groups*', {
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

    // Fill in valid credentials
    cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
    cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
    cy.get('button[type="submit"]').click();

    // Wait for the login API call
    cy.wait('@loginRequest');

    // Verify redirection to dashboard
    cy.url().should('include', '/dashboard');

    // Verify dashboard content is loaded correctly
    // Check for specific elements from the dashboard
    cy.get('h1').contains('Find the Perfect Gift Card').should('be.visible');
    cy.contains(
      'Browse our wide selection of gift cards for any occasion',
    ).should('be.visible');
    cy.get('a').contains('Browse Gift Cards').should('be.visible');

    // Verify local storage was updated with the token
    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.equal('fake_token');
      expect(win.localStorage.getItem('refresh_token')).to.equal(
        'fake_refresh',
      );
      expect(win.localStorage.getItem('access_token_expires')).to.equal('3600');
    });
  });

  it('should update form values when typing', () => {
    // Test the controlled inputs
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    cy.get('input[name="email"]')
      .type(testEmail)
      .should('have.value', testEmail);
    cy.get('input[name="password"]')
      .type(testPassword)
      .should('have.value', testPassword);
  });
});
