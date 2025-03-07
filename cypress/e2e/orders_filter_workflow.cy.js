// describe('Order List Filtering Test', () => {
//   it('navigates to the order list, applies filters, and verifies the filtered results', () => {
//     // Set up intercepts BEFORE calling cy.login
//     cy.intercept('POST', 'https://proxy.duegate.com/staging/oauth/token', {
//       // statusCode: 200,
//       body: {
//         access_token: 'dummy-token',
//         refresh_token: 'dummy-refresh-token',
//       },
//     }).as('loginRequest');
//     cy.intercept(
//       'GET',
//       'https://proxy.duegate.com/staging/dashboard?_rsc=*',
//     ).as('dashboardData');
//     cy.intercept(
//       'GET',
//       'https://proxy.duegate.com/staging/distributor-crm/v1/profile',
//     ).as('profileData');

//     // Step 1: Log in using custom login command
//     cy.login('a.miladinov@radioactive.bg', '0:y5g5NBv)$zy0<');

//     // Wait for login and subsequent data requests to complete
//     cy.wait('@loginRequest');
//     cy.wait('@dashboardData');
//     cy.wait('@profileData');

//     // Step 4: Verify that the dashboard URL is accessible
//     cy.url({ timeout: 50000 }).should('include', '/dashboard');

//     // Step 5: Navigate to the order list page
//     cy.get('a[href="/dashboard/orders"]', { timeout: 50000 })
//       .should('exist')
//       .click();
//     cy.url({ timeout: 50000 }).should('include', '/orders');

//     // Step 6: Apply filters to the order list
//     cy.get('select[id="orderStatusFilter"]', { timeout: 10000 })
//       .should('exist')
//       .select('Complete');
//     cy.screenshot('Applied-Order-Status-Filter');

//     // Step 7: Click the 'Filter' button to apply the selected filters
//     cy.get('button[id="filterButton"]')
//       .contains('Filter', { timeout: 10000 })
//       .should('exist')
//       .click();
//     cy.screenshot('Clicked-Filter-Button');

//     // Step 8: Verify that the filtering works
//     cy.get('table[id="orderList"] tbody tr', { timeout: 10000 }).then(
//       ($rows) => {
//         if ($rows.length > 0) {
//           // Iterate over each row to verify the status text
//           $rows.each((index, row) => {
//             cy.wrap(row)
//               .find('td[id="statusText"]')
//               .should('contain.text', 'Completed');
//           });
//         } else {
//           cy.log('No orders found with the specified filter criteria.');
//         }
//       },
//     );
//     cy.screenshot('Verified-Filtered-Orders');
//   });
// });

// cypress/e2e/orders-ui.cy.js

describe('Orders Page UI Test', () => {
  it('should login and verify the orders page UI', () => {
    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

    // Login with test credentials
    cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
    cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
    cy.get('button[type="submit"]').click();

    // Verify successful login by checking redirect to dashboard
    cy.url().should('include', '/dashboard');

    // Set up intercept for the orders API call
    cy.intercept('GET', '**/distributor-crm/v1/orders**').as('ordersApiCall');

    // Navigate directly to orders page
    cy.visit(
      'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/orders',
    );

    // Verify URL is correct
    cy.url().should('include', '/orders');

    // Wait for the API call to complete
    cy.wait('@ordersApiCall', { timeout: 30000 });

    // Wait for loading state to disappear (if you have a loading indicator)
    cy.get('.flex.w-full').should('not.contain', 'Loading...');

    // Wait for data to load by checking for the presence of the table with rows
    cy.get('table[id="orderList"] tbody tr', { timeout: 10000 }).should(
      'exist',
    );

    // Once data is loaded, verify the UI components
    cy.get('h1').contains('Orders').should('be.visible');
    cy.contains('A list of all the Orders in your account').should(
      'be.visible',
    );

    // Verify filter section
    cy.get('select[id="orderStatusFilter"]').should('exist');
    cy.get('button[id="filterButton"]').should('exist');

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
    cy.get('table[id="orderList"] tbody tr').then(($rows) => {
      // Log the number of orders found
      cy.log(`Found ${$rows.length} orders in the table`);

      // Make sure we have at least one row of data
      expect($rows.length).to.be.at.least(1);

      // Verify first row has all expected cells with data
      if ($rows.length > 0) {
        cy.wrap($rows).first().find('td').should('have.length', 6);
        cy.wrap($rows)
          .first()
          .find('td')
          .each(($cell) => {
            // Check that each cell has content
            expect($cell.text().trim()).to.not.equal('');
          });
      }
    });

    // Verify pagination is present
    cy.contains('Page').should('exist');

    // Take a screenshot of the complete page
    cy.screenshot('orders-page-ui');
  });
});
