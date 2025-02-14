// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  // Use an environment variable (fallback to localhost if not set)
  const apiUrl = Cypress.env('apiUrl') || 'https://proxy.duegate.com/staging';
  cy.request({
    method: 'POST',
    url: `${apiUrl}/oauth/token`,
    headers: {
      // your headers
    },
    body: {
      grant_type: 'password',
      username: email,
      password: password,
    },
  }).then((response) => {
    // Handle the response (set tokens, etc.)
  });
});
