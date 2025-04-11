// // ***********************************************
// // This example commands.js shows you how to
// // create various custom commands and overwrite
// // existing commands.
// //
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands
// // ***********************************************
// //
// //
// // -- This is a parent command --
// // Cypress.Commands.add('login', (email, password) => { ... })
// //
// //
// // -- This is a child command --
// // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
// //
// //
// // -- This is a dual command --
// // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
// //
// //
// // -- This will overwrite an existing command --
// // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// // cypress/support/commands.js
// Cypress.Commands.add('login', (email, password) => {
//   // Use an environment variable (fallback to localhost if not set)
//   const apiUrl = Cypress.env('apiUrl') || 'https://proxy.duegate.com/staging';
//   cy.request({
//     method: 'POST',
//     url: `${apiUrl}/oauth/token`,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: {
//       grant_type: 'password',
//       username: email,
//       password: password,
//     },
//   }).then((response) => {
//     // Handle the response (set tokens, etc.)
//   });
// });
// cypress/support/commands.js

// Custom login command that bypasses OTP verification
Cypress.Commands.add('login', (email, password) => {
  // Use localhost:3000 for local development
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3000';

  cy.request({
    method: 'POST',
    url: `${apiUrl}/oauth/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    form: true, // This is important for proper form encoding
    body: {
      grant_type: 'password',
      username: email,
      password: password,
    },
  }).then((response) => {
    // Store tokens in localStorage
    localStorage.setItem('access_token', response.body.access_token);
    localStorage.setItem('refresh_token', response.body.refresh_token);
    localStorage.setItem(
      'access_token_expires',
      response.body.expires_in.toString(),
    );

    // Return the response for chaining
    return response;
  });
});

// Command to bypass login UI and directly navigate to the dashboard
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.login(email, password).then(() => {
    // After setting the tokens, directly visit the dashboard
    cy.visit('http://localhost:3000/dashboard');
  });
});

// Command to set up a full authenticated session (skipping OTP)
Cypress.Commands.add('setupAuthenticatedSession', () => {
  // You can use environment variables for test credentials
  const email = Cypress.env('TEST_USER_EMAIL') || 'm.petkov2@radioactive.bg';
  const password =
    Cypress.env('TEST_USER_PASSWORD') || 'm.petkov2@radioactive.bg';

  // Set localStorage directly to simulate logged-in state
  cy.visit('http://localhost:3000/login', {
    onBeforeLoad: (window) => {
      window.localStorage.setItem('access_token', 'fake_token');
      window.localStorage.setItem('refresh_token', 'fake_refresh');
      window.localStorage.setItem('access_token_expires', '3600');
    },
  });

  // Set up mock to bypass 2FA check
  cy.intercept('GET', '**/distributor-crm/v1/profile', {
    statusCode: 200,
    body: {
      is2FAEnable: false,
      // Add other profile data as needed
    },
  }).as('profileRequest');

  // Navigate to dashboard
  cy.visit('http://localhost:3000/dashboard');
});
