describe('Catalog and Order Workflow Test', () => {
  it('navigating through the catalog, interacting with the Amazon brand, adding items to the cart, and completing the order.', () => {
    // Step 1: Log in using custom login command
    // This step logs the user into the application using their email and password.
    cy.login('a.miladinov@radioactive.bg', '0:y5g5NBv)$zy0<');

    // Step 1.2: Intercept network requests during login and wait for them to complete
    // Intercepting fetch requests for dashboard and profile data
    cy.intercept('POST', 'https://proxy.duegate.com/staging/oauth/token').as('loginRequest');
    cy.intercept('GET', '/dashboard?_rsc=*').as('dashboardData');
    cy.intercept('GET', 'https://proxy.duegate.com/staging/distributor-crm/v1/profile').as('profileData');

    // Step 1.3: Wait for network requests to complete
    cy.wait('@loginRequest');
    cy.wait('@dashboardData');
    cy.wait('@profileData');

    // Step 3: Log local storage and session storage (optional debugging step)
    cy.window().then((win) => {
      console.log(win.localStorage);
      console.log(win.sessionStorage);
    });

    // Step 4: Verify that the dashboard URL remains accessible
    cy.url({ timeout: 50000 }).should('include', '/dashboard');

    // Step 5: Navigate to the brand selection
    // Click on the button representing "Brand 1".
    cy.get('img[alt="Brand 1"]', { timeout: 10000 })
      .should('exist')
      .click();
    cy.screenshot('Click-SVG-Button');

    // Step 6: Choose an item from the catalog and add it to the cart
    // Locate and click the "Add" button for a specific item.
    cy.get('button.ml-4.rounded-md.px-3.py-1.text-black.transition.duration-150.hover\\:bg-black.hover\\:text-white.active\\:bg-indigo-200.active\\:text-indigo-700')
      .contains('Add') // Ensure it matches the button with "Add" text
      .should('exist')
      .click();
    cy.screenshot('Choose-Item');

    // Step 7: Open the cart
    // Click on the shopping cart icon to view the cart contents.
    cy.get('button[id="ShoppingBagIconButton"]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.screenshot('Click-Cart');

    // Step 8: Continue to the payment process
    // Click the "Continue to Payment" button.
    cy.get('button[id="ContinueToPaymentButton"]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.screenshot('Continue-to-Payment');

    // Step 9: Confirm the order
    // Click the "Confirm Order" button to finalize the purchase.
    cy.get(
      'div.lg\\:pl-72 > main > div > div > div > div > div > form > div.mt-10.lg\\:mt-0 > div > div > button',
      { timeout: 10000 }
    )
      .should('be.visible')
      .click();
    cy.screenshot('Confirm-Order');
  });
});
