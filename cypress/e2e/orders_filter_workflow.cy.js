describe('Order List Filtering Test', () => {
  it('navigates to the order list, applies filters, and verifies the filtered results', () => {
    // Set up intercepts BEFORE calling cy.login
    cy.intercept('POST', 'https://proxy.duegate.com/staging/oauth/token', {
      statusCode: 200,
      body: {
        access_token: 'dummy-token',
        refresh_token: 'dummy-refresh-token',
      },
    }).as('loginRequest');
    cy.intercept(
      'GET',
      'https://proxy.duegate.com/staging/dashboard?_rsc=*',
    ).as('dashboardData');
    cy.intercept(
      'GET',
      'https://proxy.duegate.com/staging/distributor-crm/v1/profile',
    ).as('profileData');

    // Step 1: Log in using custom login command
    cy.login('a.miladinov@radioactive.bg', '0:y5g5NBv)$zy0<');

    // Wait for login and subsequent data requests to complete
    cy.wait('@loginRequest');
    cy.wait('@dashboardData');
    cy.wait('@profileData');

    // Step 4: Verify that the dashboard URL is accessible
    cy.url({ timeout: 50000 }).should('include', '/dashboard');

    // Step 5: Navigate to the order list page
    cy.get('a[href="/dashboard/orders"]', { timeout: 50000 })
      .should('exist')
      .click();
    cy.url({ timeout: 50000 }).should('include', '/orders');

    // Step 6: Apply filters to the order list
    cy.get('select[id="orderStatusFilter"]', { timeout: 10000 })
      .should('exist')
      .select('Complete');
    cy.screenshot('Applied-Order-Status-Filter');

    // Step 7: Click the 'Filter' button to apply the selected filters
    cy.get('button[id="filterButton"]')
      .contains('Filter', { timeout: 10000 })
      .should('exist')
      .click();
    cy.screenshot('Clicked-Filter-Button');

    // Step 8: Verify that the filtering works
    cy.get('table[id="orderList"] tbody tr', { timeout: 10000 }).then(
      ($rows) => {
        if ($rows.length > 0) {
          // Iterate over each row to verify the status text
          $rows.each((index, row) => {
            cy.wrap(row)
              .find('td[id="statusText"]')
              .should('contain.text', 'Completed');
          });
        } else {
          cy.log('No orders found with the specified filter criteria.');
        }
      },
    );
    cy.screenshot('Verified-Filtered-Orders');
  });
});
