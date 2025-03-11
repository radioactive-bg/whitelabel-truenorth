// cypress/e2e/orders-ui.cy.js
// describe('Orders Page UI Test', () => {
//   it('should login, navigate to orders page, and verify UI elements', () => {
//     // Visit the login page with basic auth
//     cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

//     // Login with test credentials - visible in the Cypress runner
//     cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
//     cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
//     cy.get('button[type="submit"]').click();

//     // Verify successful login by checking redirect to dashboard
//     cy.url().should('include', '/dashboard');

//     // Take a screenshot after login
//     cy.screenshot('after-login-dashboard');

//     // Set up intercept for the orders API call
//     cy.intercept('GET', '**/distributor-crm/v1/orders**').as('ordersApiCall');

//     // Navigate directly to orders page
//     cy.visit(
//       'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/orders',
//     );

//     // Verify URL is correct
//     cy.url().should('include', '/dashboard/orders');

//     // Wait for the API call to complete
//     cy.wait('@ordersApiCall', { timeout: 30000 });

//     // Wait for loading state to disappear
//     cy.get('.InvoicesTableSkeleton', { timeout: 10000 }).should('not.exist');

//     // Check for table existence
//     cy.get('table[id="orderList"]', { timeout: 15000 }).should('be.visible');

//     // Once data is loaded, verify the UI components
//     cy.get('h1').contains('Orders').should('be.visible');
//     cy.contains('A list of all the Orders in your account').should(
//       'be.visible',
//     );

//     // Verify table headers
//     cy.get('table[id="orderList"] thead th').should('have.length', 6);
//     cy.get('table[id="orderList"] thead th')
//       .eq(0)
//       .should('contain', 'Order ID');
//     cy.get('table[id="orderList"] thead th')
//       .eq(1)
//       .should('contain', 'Operator');
//     cy.get('table[id="orderList"] thead th')
//       .eq(2)
//       .should('contain', 'Order Value');
//     cy.get('table[id="orderList"] thead th')
//       .eq(3)
//       .should('contain', 'Date of Order');
//     cy.get('table[id="orderList"] thead th').eq(4).should('contain', 'Status');

//     // Verify that table contains data rows
//     cy.get('table[id="orderList"] tbody tr').should('have.length.at.least', 1);

//     // Verify the first row has all the expected data
//     cy.get('table[id="orderList"] tbody tr')
//       .first()
//       .within(() => {
//         // Order ID
//         cy.get('td').eq(0).should('not.be.empty');
//         // Operator
//         cy.get('td').eq(1).should('not.be.empty');
//         // Order Value
//         cy.get('td').eq(2).should('not.be.empty');
//         // Date of Order
//         cy.get('td').eq(3).should('not.be.empty');
//         // Status
//         cy.get('td').eq(4).find('span').should('exist');
//         // View button
//         cy.get('td').eq(5).find('button').contains('View').should('be.visible');
//       });

//     // Test filter functionality
//     // Get the Order ID from the first row to use in filter
//     cy.get('table[id="orderList"] tbody tr')
//       .first()
//       .find('td')
//       .eq(0)
//       .invoke('text')
//       .then((orderId) => {
//         const cleanOrderId = orderId.trim();
//         cy.log(`Using Order ID for filter: ${cleanOrderId}`);

//         // Enter the Order ID in the filter
//         cy.contains('label', 'Order ID')
//           .parent()
//           .find('input')
//           .clear()
//           .type(cleanOrderId);

//         // Click the Filter button
//         cy.get('button').contains('Filter').click();

//         // Wait for the filtered API call to complete
//         cy.wait('@ordersApiCall', { timeout: 30000 });

//         // Verify filtered results
//         cy.get('table[id="orderList"] tbody tr').should('have.length', 1);
//         cy.get('table[id="orderList"] tbody tr')
//           .first()
//           .should('contain', cleanOrderId);

//         // Take a screenshot of filtered results
//         cy.screenshot('filter-by-orderid');

//         // Reset filters
//         cy.contains('button', 'Reset').click();
//         cy.wait('@ordersApiCall', { timeout: 30000 });

//         // Verify filter was reset (more than 1 row should appear)
//         cy.get('table[id="orderList"] tbody tr').should(
//           'have.length.at.least',
//           1,
//         );
//       });

//     // Test Status filter
//     cy.get('select[id="orderStatusFilter"]').then(($select) => {
//       if ($select.find('option').length > 1) {
//         // Select a non-empty status option
//         cy.get('select[id="orderStatusFilter"] option')
//           .eq(1)
//           .then(($option) => {
//             const statusText = $option.text().trim();
//             cy.get('select[id="orderStatusFilter"]').select(statusText);

//             // Click the Filter button
//             cy.get('button').contains('Filter').click();

//             // Wait for the filtered API call to complete
//             cy.wait('@ordersApiCall', { timeout: 30000 });

//             // Take a screenshot of status filtered results
//             cy.screenshot('filter-by-status');

//             // Reset filters
//             cy.contains('button', 'Reset').click();
//             cy.wait('@ordersApiCall', { timeout: 30000 });
//           });
//       }
//     });

//     // Verify pagination component exists
//     cy.get('nav').should('exist');

//     // Test pagination if possible
//     cy.contains('button', 'Next').then(($nextBtn) => {
//       if ($nextBtn.is(':visible') && !$nextBtn.prop('disabled')) {
//         cy.wrap($nextBtn).click();
//         cy.wait('@ordersApiCall');
//       }
//     });

//     // Go back to page 1 if we navigated away
//     cy.contains('button', '3').then(($firstPageBtn) => {
//       if ($firstPageBtn.is(':visible') && !$firstPageBtn.prop('disabled')) {
//         cy.wrap($firstPageBtn).click();
//         cy.wait('@ordersApiCall');
//       }
//     });

//     // Test view order functionality
//     cy.get('table[id="orderList"] tbody tr')
//       .first()
//       .find('button')
//       .contains('View')
//       .click();

//     // Verify we've navigated to a specific order page
//     cy.url().should('match', /\/dashboard\/orders\/\d+/);
//     cy.screenshot('order-details-page');
//   });
// });
describe('Orders Dashboard Tests', () => {
  beforeEach(() => {
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

    // Visit the orders page before each test
    cy.visit(
      'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/orders',
    );

    // Intercept API calls to orders endpoint
    // Set up intercept for the orders API call
    cy.intercept('GET', '**/distributor-crm/v1/orders**').as('ordersApiCall');
    cy.wait('@ordersApiCall', { timeout: 30000 });
  });

  // it('should verify UI components and table structure', () => {
  //   // Take a screenshot after login
  //   cy.screenshot('after-login-dashboard');

  //   // Verify the UI components
  //   cy.get('h1').contains('Orders').should('be.visible');
  //   cy.contains('A list of all the Orders in your account').should(
  //     'be.visible',
  //   );

  //   // Verify table headers
  //   cy.get('table[id="orderList"] thead th').should('have.length', 6);
  //   cy.get('table[id="orderList"] thead th')
  //     .eq(0)
  //     .should('contain', 'Order ID');
  //   cy.get('table[id="orderList"] thead th')
  //     .eq(1)
  //     .should('contain', 'Operator');
  //   cy.get('table[id="orderList"] thead th')
  //     .eq(2)
  //     .should('contain', 'Order Value');
  //   cy.get('table[id="orderList"] thead th')
  //     .eq(3)
  //     .should('contain', 'Date of Order');
  //   cy.get('table[id="orderList"] thead th').eq(4).should('contain', 'Status');

  //   // Verify that table contains data rows
  //   cy.get('table[id="orderList"] tbody tr').should('have.length.at.least', 1);

  //   // Verify the first row has all the expected data
  //   cy.get('table[id="orderList"] tbody tr')
  //     .first()
  //     .within(() => {
  //       // Order ID
  //       cy.get('td').eq(0).should('not.be.empty');
  //       // Operator
  //       cy.get('td').eq(1).should('not.be.empty');
  //       // Order Value
  //       cy.get('td').eq(2).should('not.be.empty');
  //       // Date of Order
  //       cy.get('td').eq(3).should('not.be.empty');
  //       // Status
  //       cy.get('td').eq(4).find('span').should('exist');
  //       // View button
  //       cy.get('td').eq(5).find('button').contains('View').should('be.visible');
  //     });
  // });

  // it('should test pagination functionality', () => {
  //   // Verify pagination component exists
  //   cy.get('nav').should('exist');

  //   // Test pagination if possible
  //   cy.contains('button', 'Next').then(($nextBtn) => {
  //     if ($nextBtn.is(':visible') && !$nextBtn.prop('disabled')) {
  //       cy.wrap($nextBtn).click();
  //       cy.wait('@ordersApiCall');
  //     }
  //   });

  //   // Go back to page 1 if we navigated away
  //   cy.contains('button', '3').then(($firstPageBtn) => {
  //     if ($firstPageBtn.is(':visible') && !$firstPageBtn.prop('disabled')) {
  //       cy.wrap($firstPageBtn).click();
  //       cy.wait('@ordersApiCall');
  //     }
  //   });
  // });

  // it('should navigate to order details page', () => {
  //   // Test view order functionality
  //   cy.get('table[id="orderList"] tbody tr')
  //     .first()
  //     .find('button')
  //     .contains('View')
  //     .click();

  //   // Verify we've navigated to a specific order page
  //   cy.url().should('match', /\/dashboard\/orders\/\d+/);
  //   cy.screenshot('order-details-page');
  // });
  // it('should filter orders by Order ID', () => {
  //   // Get the Order ID from the first row to use in filter
  //   cy.get('table[id="orderList"] tbody tr')
  //     .first()
  //     .find('td')
  //     .eq(0)
  //     .invoke('text')
  //     .then((orderId) => {
  //       const cleanOrderId = orderId.trim();
  //       cy.log(`Using Order ID for filter: ${cleanOrderId}`);

  //       // Enter the Order ID in the filter
  //       cy.contains('label', 'Order ID')
  //         .parent()
  //         .find('input')
  //         .clear()
  //         .type(cleanOrderId);

  //       // Click the Filter button
  //       cy.get('button').contains('Filter').click();

  //       // Wait for the filtered API call to complete
  //       cy.wait('@ordersApiCall', { timeout: 30000 });

  //       // Verify filtered results
  //       cy.get('table[id="orderList"] tbody tr').should('have.length', 1);
  //       cy.get('table[id="orderList"] tbody tr')
  //         .first()
  //         .should('contain', cleanOrderId);

  //       // Take a screenshot of filtered results
  //       cy.screenshot('filter-by-orderid');

  //       // Reset filters
  //       cy.contains('button', 'Reset').click();
  //       cy.wait('@ordersApiCall', { timeout: 30000 });

  //       // Verify filter was reset (more than 1 row should appear)
  //       cy.get('table[id="orderList"] tbody tr').should(
  //         'have.length.at.least',
  //         1,
  //       );
  //     });
  // });

  // it('should apply multiple filters simultaneously', () => {
  //   // Set Items Per Page
  //   cy.contains('label', 'Items on Page')
  //     .parent()
  //     .find('input')
  //     .clear()
  //     .type('8');

  //   // Select a Status if available
  //   cy.get('select[id="orderStatusFilter"]').then(($select) => {
  //     if ($select.find('option').length > 1) {
  //       cy.get('select[id="orderStatusFilter"] option')
  //         .eq(1)
  //         .then(($option) => {
  //           const statusText = $option.text().trim();
  //           cy.get('select[id="orderStatusFilter"]').select(statusText);
  //         });
  //     }
  //   });

  //   // Click the Filter button
  //   cy.get('button#filterButton').click();

  //   // Wait for the filtered API call to complete
  //   cy.wait('@ordersApiCall', { timeout: 30000 });

  //   // Take a screenshot of multiple filters applied
  //   cy.screenshot('multiple-filters-applied');

  //   // Reset filters
  //   cy.contains('button', 'Reset').click();
  //   cy.wait('@ordersApiCall', { timeout: 30000 });
  // });

  it('should filter orders by Status', () => {
    cy.get('select[id="orderStatusFilter"]').then(($select) => {
      if ($select.find('option').length > 1) {
        // Select a non-empty status option
        cy.get('select[id="orderStatusFilter"] option')
          .eq(1)
          .then(($option) => {
            const statusText = $option.text().trim();
            cy.get('select[id="orderStatusFilter"]').select(statusText);

            // Click the Filter button
            cy.get('button').contains('Filter').click();

            // Wait for the filtered API call to complete
            cy.wait('@ordersApiCall', { timeout: 30000 });

            // Take a screenshot of status filtered results
            cy.screenshot('filter-by-status');

            // Reset filters
            cy.contains('button', 'Reset').click();
            cy.wait('@ordersApiCall', { timeout: 30000 });
          });
      }
    });
  });

  it('should filter orders by Product Group', () => {
    cy.get('select[id="productGroupSelect"]').then(($select) => {
      if ($select.find('option').length > 1) {
        // Select a non-empty status option
        cy.get('select[id="productGroupSelect"] option')
          .eq(1)
          .then(($option) => {
            const productGroupText = $option.text().trim();
            cy.get('select[id="productGroupSelect"]').select(productGroupText);

            // Click the Filter button
            cy.get('button').contains('Filter').click();

            // Wait for the filtered API call to complete
            cy.wait('@ordersApiCall', { timeout: 30000 });

            // Take a screenshot of status filtered results
            cy.screenshot('filter-by-status');

            // Reset filters
            cy.contains('button', 'Reset').click();
            cy.wait('@ordersApiCall', { timeout: 30000 });
          });
      }
    });
  });

  // it('should filter orders by Product Group', () => {
  //   // First check if the product group select exists at all, with a longer timeout
  //   cy.get('body').then(($body) => {
  //     // Check if product group select exists
  //     if ($body.find('select[id="productGroup"]').length > 0) {
  //       // Wait for the select to be visible and have options
  //       cy.get('select[id="productGroup"]', { timeout: 30000 })
  //         .should('be.visible')
  //         .then(($select) => {
  //           if ($select.find('option').length > 1) {
  //             // Select a non-empty product group option
  //             cy.get('select[id="productGroup"] option')
  //               .eq(1)
  //               .then(($option) => {
  //                 const productGroupText = $option.text().trim();
  //                 cy.get('select[id="productGroup"]').select(productGroupText);

  //                 // Click the Filter button
  //                 cy.get('button#filterButton').click();

  //                 // Wait for the filtered API call to complete
  //                 cy.wait('@ordersApiCall', { timeout: 30000 });

  //                 // Take a screenshot of product group filtered results
  //                 cy.screenshot('filter-by-product-group');

  //                 // Reset filters
  //                 cy.contains('button', 'Reset').click();
  //                 cy.wait('@ordersApiCall', { timeout: 30000 });
  //               });
  //           } else {
  //             cy.log(
  //               'Product Group dropdown has no options other than default - skipping test',
  //             );
  //           }
  //         });
  //     } else {
  //       // If the select doesn't exist at all, log it and pass the test
  //       cy.log('Product Group filter not found in this view - skipping test');
  //     }
  //   });
  // });

  // it('should filter orders by Items Per Page', () => {
  //   // Test Items Per Page filter
  //   cy.contains('label', 'Items on Page')
  //     .parent()
  //     .find('input')
  //     .clear()
  //     .type('5');

  //   // Click the Filter button
  //   cy.get('button#filterButton').click();

  //   // Wait for the filtered API call to complete
  //   cy.wait('@ordersApiCall', { timeout: 30000 });

  //   // Verify that the number of rows matches or is less than what we specified
  //   cy.get('table[id="orderList"] tbody tr').should('have.length.at.most', 5);

  //   // Take a screenshot
  //   cy.screenshot('filter-by-items-per-page');

  //   // Reset filters
  //   cy.contains('button', 'Reset').click();
  //   cy.wait('@ordersApiCall', { timeout: 30000 });
  // });

  // it('should filter orders by Date Range', () => {
  //   // Open Date From calendar
  //   cy.contains('label', 'Date From').parent().find('button').click();

  //   // Select a date from the calendar - adjust the selector if needed for your specific calendar implementation
  //   cy.get(
  //     '.react-calendar__month-view__days button, [class*="CalendarDay"]:not([aria-disabled="true"])',
  //   )
  //     .first()
  //     .click();

  //   // Open Date To calendar
  //   cy.contains('label', 'Date To').parent().find('button').click();

  //   // Select a date from the calendar - adjust the selector if needed
  //   cy.get(
  //     '.react-calendar__month-view__days button, [class*="CalendarDay"]:not([aria-disabled="true"])',
  //   )
  //     .last()
  //     .click();

  //   // Click the Filter button
  //   cy.get('button#filterButton').click();

  //   // Wait for the filtered API call to complete
  //   cy.wait('@ordersApiCall', { timeout: 30000 });

  //   // Take a screenshot
  //   cy.screenshot('filter-by-date-range');

  //   // Reset filters
  //   cy.contains('button', 'Reset').click();
  //   cy.wait('@ordersApiCall', { timeout: 30000 });
  // });
});
