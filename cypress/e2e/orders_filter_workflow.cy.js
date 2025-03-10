// cypress/e2e/orders-ui.cy.js
describe('Orders Page UI Test', () => {
  it('should login, navigate to orders page, and verify UI elements', () => {
    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

    // Login with test credentials - visible in the Cypress runner
    cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
    cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
    cy.get('button[type="submit"]').click();

    // Verify successful login by checking redirect to dashboard
    cy.url().should('include', '/dashboard');

    // Take a screenshot after login
    cy.screenshot('after-login-dashboard');

    // Set up intercept for the orders API call
    cy.intercept('GET', '**/distributor-crm/v1/orders**').as('ordersApiCall');

    // Navigate directly to orders page
    cy.visit(
      'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/orders',
    );

    // Verify URL is correct
    cy.url().should('include', '/dashboard/orders');

    // Wait for the API call to complete
    cy.wait('@ordersApiCall', { timeout: 30000 });

    // Wait for loading state to disappear
    cy.get('.InvoicesTableSkeleton', { timeout: 10000 }).should('not.exist');

    // Check for table existence
    cy.get('table[id="orderList"]', { timeout: 15000 }).should('be.visible');

    // Once data is loaded, verify the UI components
    cy.get('h1').contains('Orders').should('be.visible');
    cy.contains('A list of all the Orders in your account').should(
      'be.visible',
    );

    // Verify table headers
    cy.get('table[id="orderList"] thead th').should('have.length', 6);
    cy.get('table[id="orderList"] thead th')
      .eq(0)
      .should('contain', 'Order ID');
    cy.get('table[id="orderList"] thead th')
      .eq(1)
      .should('contain', 'Operator');
    cy.get('table[id="orderList"] thead th')
      .eq(2)
      .should('contain', 'Order Value');
    cy.get('table[id="orderList"] thead th')
      .eq(3)
      .should('contain', 'Date of Order');
    cy.get('table[id="orderList"] thead th').eq(4).should('contain', 'Status');

    // Verify that table contains data rows
    cy.get('table[id="orderList"] tbody tr').should('have.length.at.least', 1);

    // Verify the first row has all the expected data
    cy.get('table[id="orderList"] tbody tr')
      .first()
      .within(() => {
        // Order ID
        cy.get('td').eq(0).should('not.be.empty');
        // Operator
        cy.get('td').eq(1).should('not.be.empty');
        // Order Value
        cy.get('td').eq(2).should('not.be.empty');
        // Date of Order
        cy.get('td').eq(3).should('not.be.empty');
        // Status
        cy.get('td').eq(4).find('span').should('exist');
        // View button
        cy.get('td').eq(5).find('button').contains('View').should('be.visible');
      });

    // Verify pagination component exists
    cy.get('nav').should('exist');

    // Test pagination if possible
    cy.contains('button', 'Next').then(($nextBtn) => {
      if ($nextBtn.is(':visible') && !$nextBtn.prop('disabled')) {
        cy.wrap($nextBtn).click();
        cy.wait('@ordersApiCall');
      }
    });

    // Go back to page 1 if we navigated away
    cy.contains('button', '3').then(($firstPageBtn) => {
      if ($firstPageBtn.is(':visible') && !$firstPageBtn.prop('disabled')) {
        cy.wrap($firstPageBtn).click();
        cy.wait('@ordersApiCall');
      }
    });

    // Test view order functionality
    cy.get('table[id="orderList"] tbody tr')
      .first()
      .find('button')
      .contains('View')
      .click();

    // Verify we've navigated to a specific order page
    cy.url().should('match', /\/dashboard\/orders\/\d+/);
    cy.screenshot('order-details-page');
  });
});
