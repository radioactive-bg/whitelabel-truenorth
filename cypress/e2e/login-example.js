Cypress.Commands.add('login', (username, password) => {
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group');
    cy.get('#username').type('a.miladinov@radioactive.bg'); // Use quotes for strings
    cy.get('#password').type('0:y5g5NBv)$zy0<');           // Use quotes for strings
    cy.get('button[type="submit"]').click();
});
