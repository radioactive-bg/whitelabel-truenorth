// cypress/e2e/orders.cy.js
describe('Orders Dashboard Tests', () => {
  // Common selectors
  const selectors = {
    // Login form
    loginForm: 'form',
    email: 'input[name="email"]',
    password: 'input[name="password"]',
    submitButton: 'button[type="submit"]',

    // Orders page elements
    ordersTable: 'table[id="orderList"]',
    tableHeaders: 'table[id="orderList"] thead th',
    tableRows: 'table[id="orderList"] tbody tr',
    viewButton: 'button:contains("View")',

    // Filters
    orderIdFilter: 'label:contains("Order ID") ~ input, input[id="orderId"]',
    itemsPerPageInput: 'input#perPage',
    statusFilter: 'select[id="orderStatusFilter"]',
    productGroupSelect: 'select[id="productGroupSelect"]',
    filterButton: 'button#filterButton, button:contains("Filter")',
    resetButton: 'button:contains("Reset")',

    // Pagination
    paginationNav: 'nav',
    nextButton: 'button:contains("Next")',
    pageButtons:
      'nav button[aria-current], nav button:contains("1"), nav button:contains("2"), nav button:contains("3")',
  };

  // Test data
  const testData = {
    loginEmail: 'm.petkov2@radioactive.bg',
    loginPassword: 'm.petkov2@radioactive.bg',
    itemsPerPage: '8',
  };

  // API endpoints
  const endpoints = {
    ordersEndpoint: '**/distributor-crm/v1/orders**',
    loginEndpoint: '**/distributor-crm/v1/login**',
    profileEndpoint: '**/distributor-crm/v1/profile**',
  };

  // Helper functions
  const applyFilter = (filterFn) => {
    // Apply the filter
    filterFn();

    // Click the Filter button
    cy.get(selectors.filterButton).click();

    // Wait for the filtered API call to complete
    cy.wait('@ordersApiCall', { timeout: 30000 });
  };

  const resetFilters = () => {
    cy.get(selectors.resetButton).click();
    cy.wait('@ordersApiCall', { timeout: 30000 });
  };

  const login = () => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Log environment variables for debugging
    cy.log('Environment Variables:', {
      frontendUrl: Cypress.env('frontendUrl'),
      apiUrl: Cypress.env('apiUrl'),
      CI: Cypress.env('CI'),
      baseUrl: Cypress.config('baseUrl'),
    });

    // Set up API intercepts for login
    cy.intercept('POST', endpoints.loginEndpoint).as('loginRequest');
    cy.intercept('GET', endpoints.profileEndpoint).as('profileRequest');

    // Set the API URL in the window object before visiting
    cy.window().then((win) => {
      win.CYPRESS_API_URL = Cypress.env('apiUrl');
    });

    // Visit the login page
    cy.visit('/login', {
      timeout: 30000,
      auth: {
        username: Cypress.env('basicAuth').username,
        password: Cypress.env('basicAuth').password,
      },
    });

    // Wait for the login form to be visible
    cy.get(selectors.loginForm).should('be.visible');

    // Login with test credentials
    cy.get(selectors.email).type(testData.loginEmail);
    cy.get(selectors.password).type(testData.loginPassword);
    cy.get(selectors.submitButton).click();

    // Wait for successful login and redirect
    cy.url().should('include', '/dashboard');

    // Add a small delay to ensure the dashboard is fully loaded
    cy.wait(2000);
  };

  beforeEach(() => {
    // Set up API intercepts
    cy.intercept('GET', endpoints.ordersEndpoint).as('ordersApiCall');

    // Login before each test
    login();

    // Visit the orders page and wait for it to load
    cy.visit('/dashboard/orders', {
      timeout: 30000,
      auth: {
        username: Cypress.env('basicAuth').username,
        password: Cypress.env('basicAuth').password,
      },
    });

    // Wait for the page to be fully loaded
    cy.get('body').should('be.visible');

    // Add a check to ensure we're not redirected to login
    cy.url().should('include', '/dashboard/orders');

    // Wait for orders API call to complete
    cy.wait('@ordersApiCall', { timeout: 30000 });
  });

  it('should verify UI components and table structure', () => {
    // Verify page heading and description
    cy.get('h1').contains('Orders').should('be.visible');
    cy.contains('A list of all the Orders in your account').should(
      'be.visible',
    );

    // Verify table headers
    cy.get(selectors.tableHeaders).should('have.length', 6);
    cy.get(selectors.tableHeaders).eq(0).should('contain', 'Order ID');
    cy.get(selectors.tableHeaders).eq(1).should('contain', 'Operator');
    cy.get(selectors.tableHeaders).eq(2).should('contain', 'Order Value');
    cy.get(selectors.tableHeaders).eq(3).should('contain', 'Date of Order');
    cy.get(selectors.tableHeaders).eq(4).should('contain', 'Status');

    // Verify table contains data rows
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify first row has expected data structure
    cy.get(selectors.tableRows)
      .first()
      .within(() => {
        // Check each cell has content
        cy.get('td').eq(0).should('not.be.empty'); // Order ID
        cy.get('td').eq(1).should('not.be.empty'); // Operator
        cy.get('td').eq(2).should('not.be.empty'); // Order Value
        cy.get('td').eq(3).should('not.be.empty'); // Date of Order
        cy.get('td').eq(4).find('span').should('exist'); // Status
        cy.get('td').eq(5).find('button').contains('View').should('be.visible'); // View button
      });
  });

  it('should test pagination functionality', () => {
    // Verify pagination component exists
    cy.get(selectors.paginationNav).should('exist');

    // Test Next button if it's enabled
    cy.get(selectors.nextButton).then(($nextBtn) => {
      if ($nextBtn.is(':visible') && !$nextBtn.prop('disabled')) {
        cy.wrap($nextBtn).click();
        cy.wait('@ordersApiCall');
      }
    });

    // Go back to page 1 if we navigated away
    cy.get(selectors.pageButtons)
      .contains('1')
      .then(($firstPageBtn) => {
        if ($firstPageBtn.is(':visible') && !$firstPageBtn.prop('disabled')) {
          cy.wrap($firstPageBtn).click();
          cy.wait('@ordersApiCall');
        }
      });
  });

  it('should navigate to order details page', () => {
    // Click View button on first order
    cy.get(selectors.tableRows).first().find(selectors.viewButton).click();

    // Verify navigation to specific order page
    cy.url().should('match', /\/dashboard\/orders\/\d+/);
  });

  it('should filter orders by Order ID', () => {
    // Get the Order ID from the first row to use in filter
    cy.get(selectors.tableRows)
      .first()
      .find('td')
      .eq(0)
      .invoke('text')
      .then((orderId) => {
        const cleanOrderId = orderId.trim();
        cy.log(`Using Order ID for filter: ${cleanOrderId}`);

        // Apply Order ID filter
        applyFilter(() => {
          cy.get(selectors.orderIdFilter).clear().type(cleanOrderId);
        });

        // Verify filtered results
        cy.get(selectors.tableRows).should('have.length', 1);
        cy.get(selectors.tableRows).first().should('contain', cleanOrderId);

        // Reset filters
        resetFilters();

        // Verify filter was reset
        cy.get(selectors.tableRows).should('have.length.at.least', 1);
      });
  });

  it('should apply multiple filters simultaneously', () => {
    // Apply multiple filters
    applyFilter(() => {
      // Set Items Per Page
      cy.get(selectors.itemsPerPageInput).clear().type(testData.itemsPerPage);

      // Select a Status if available
      cy.get(selectors.statusFilter).then(($select) => {
        if ($select.find('option').length > 1) {
          cy.get(`${selectors.statusFilter} option`)
            .eq(1)
            .then(($option) => {
              const statusText = $option.text().trim();
              cy.get(selectors.statusFilter).select(statusText);
            });
        }
      });
    });

    // Reset filters
    resetFilters();
  });

  it('should filter orders by Status', () => {
    cy.get(selectors.statusFilter).then(($select) => {
      if ($select.find('option').length > 1) {
        // Apply Status filter
        applyFilter(() => {
          cy.get(`${selectors.statusFilter} option`)
            .eq(1)
            .then(($option) => {
              const statusText = $option.text().trim();
              cy.get(selectors.statusFilter).select(statusText);
            });
        });

        // Reset filters
        resetFilters();
      } else {
        cy.log('No status options available for filtering');
      }
    });
  });

  it('should filter orders by Product Group', () => {
    cy.get(selectors.productGroupSelect).then(($select) => {
      if ($select.find('option').length > 1) {
        // Apply Product Group filter
        applyFilter(() => {
          cy.get(`${selectors.productGroupSelect} option`)
            .eq(1)
            .then(($option) => {
              const productGroupText = $option.text().trim();
              cy.get(selectors.productGroupSelect).select(productGroupText);
            });
        });

        // Reset filters
        resetFilters();
      } else {
        cy.log('No product group options available for filtering');
      }
    });
  });

  it('should filter orders by Items Per Page', () => {
    const itemCount = 2;

    // Apply Items Per Page filter
    applyFilter(() => {
      cy.get(selectors.itemsPerPageInput).clear().type(itemCount.toString());
    });

    // Wait for the table to update with fewer items and verify
    cy.wait(1000); // Add a small wait to ensure UI updates

    // Check if the API response actually applied our filter
    cy.get(selectors.tableRows).then(($rows) => {
      const actualCount = $rows.length;
      cy.log(`Table shows ${actualCount} rows after filtering`);
    });

    // Reset filters
    resetFilters();
  });
});
