describe('Catalog and Order Workflow Test', () => {
  it('navigating through the catalog, interacting with the Amazon brand, adding items to the cart, and completing the order.', () => {
    // Set up intercepts BEFORE calling cy.login
    cy.intercept('POST', 'https://proxy.duegate.com/staging/oauth/token', {
      //statusCode: 200,
      body: {
        access_token: 'dummy-token',
        refresh_token: 'dummy-refresh-token',
      },
    }).as('loginRequest');
    // cy.intercept(
    //   'GET',
    //   'https://proxy.duegate.com/staging/dashboard?_rsc=*',
    // ).as('dashboardData');
    cy.intercept(
      'GET',
      'https://proxy.duegate.com/staging/distributor-crm/v1/profile',
    ).as('profileData');

    // Step 1: Log in using custom login command
    cy.login('a.miladinov@radioactive.bg', '0:y5g5NBv)$zy0<');

    // Wait for login and subsequent data requests to complete
    cy.wait('@loginRequest');
    //cy.wait('@dashboardData');
    cy.wait('@profileData');

    // Step 3: Debugging - log local and session storage
    cy.window().then((win) => {
      console.log(win.localStorage);
      console.log(win.sessionStorage);
    });

    // Step 4: Verify that the dashboard URL remains accessible
    cy.url({ timeout: 50000 }).should('include', '/dashboard');

    // Step 5: Navigate to the brand selection
    cy.get('img[alt="Brand 1"]', { timeout: 10000 }).should('exist').click();
    cy.screenshot('Click-SVG-Button');

    // Step 6: Choose an item from the catalog and add it to the cart
    cy.get(
      'button.ml-4.rounded-md.px-3.py-1.text-black.transition.duration-150.hover\\:bg-black.hover\\:text-white.active\\:bg-indigo-200.active\\:text-indigo-700',
    )
      .contains('Add')
      .should('exist')
      .click();
    cy.screenshot('Choose-Item');

    // Step 7: Open the cart
    cy.get('button[id="ShoppingBagIconButton"]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.screenshot('Click-Cart');

    // Step 8: Continue to the payment process
    cy.get('button[id="ContinueToPaymentButton"]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.screenshot('Continue-to-Payment');

    // Step 9: Confirm the order
    cy.get(
      'div.lg\\:pl-72 > main > div > div > div > div > div > form > div.mt-10.lg\\:mt-0 > div > div > button',
      { timeout: 10000 },
    )
      .should('be.visible')
      .click();
    cy.screenshot('Confirm-Order');
  });
});
