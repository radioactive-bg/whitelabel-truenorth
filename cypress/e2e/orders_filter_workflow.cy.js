describe('Order List Filtering Test', () => {
    it('navigates to the order list, applies filters, and verifies the filtered results', () => {
      // Step 1: Log in using custom login command
      cy.login('a.miladinov@radioactive.bg', '0:y5g5NBv)$zy0<');
  
      // Step 2: Intercept network requests during login and wait for them to complete
      cy.intercept('POST', 'https://proxy.duegate.com/staging/oauth/token').as('loginRequest');
      cy.intercept('GET', '/dashboard?_rsc=*').as('dashboardData');
      cy.intercept('GET', 'https://proxy.duegate.com/staging/distributor-crm/v1/profile').as('profileData');
  
      // Step 3: Wait for network requests to complete
      cy.wait('@loginRequest');
      cy.wait('@dashboardData');
      cy.wait('@profileData');
  
      // Step 4: Verify that the dashboard URL is accessible
      cy.url({ timeout: 50000 }).should('include', '/dashboard');
  
      // Step 5: Navigate to the order list page
      cy.get('a[href="/dashboard/orders"]', { timeout: 50000 }) // Adjust the selector based on your application's navigation structure
        .should('exist')
        .click();
      cy.url({ timeout: 50000 }).should('include', '/orders');
  
      // Step 6: Apply filters to the order list
      // Example: Filter orders by status 'Completed'
      cy.get('select[id="orderStatusFilter"]', { timeout: 10000 }) // Adjust the selector based on your application's filter element
        .should('exist')
        .select('Complete');
      cy.screenshot('Applied-Order-Status-Filter');
   
      // Step 7: Click the 'Filter' button to apply the selected filters
      cy.get('button[id="filterButton"]').contains('Filter', { timeout: 10000 }) // Adjust the selector if necessary
        .should('exist')
        .click();
      cy.screenshot('Clicked-Filter-Button');
  
      // Step 8: Verify that the filtering works
      cy.get('table[id="orderList"] tbody tr', { timeout: 10000 }) // Adjust the selector based on your application's order list structure
      .then(($rows) => {
        if ($rows.length > 0) {
          // Iterate over each row to verify the status
          $rows.each((index, row) => {
            cy.wrap(row)
              .find('td[id="statusText"]') // Adjust the selector to target the status cell within the row
              .should('contain.text', 'Completed');
          });
        } else {
          // Handle the case where no rows are present
          cy.log('No orders found with the specified filter criteria.');
        }
      });
      cy.screenshot('Verified-Filtered-Orders');

    });
  });
  