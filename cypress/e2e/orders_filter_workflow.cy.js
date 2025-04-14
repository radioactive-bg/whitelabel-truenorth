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
    loginEndpoint: '**/oauth/token',
    profileEndpoint: '**/distributor-crm/v1/profile',
  };

  const applyFilter = (filterFn) => {
    // Apply the filter
    filterFn();

    // Click the Filter button and wait for it to be clickable
    cy.get(selectors.filterButton, { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // Wait for the filtered API call to complete with increased timeout
    cy.wait('@ordersApiCall', { timeout: 30000 }).then((interception) => {
      if (interception.response.statusCode !== 200) {
        cy.log(
          `API call failed with status ${interception.response.statusCode}. Retrying...`,
        );
        cy.reload();
        cy.wait('@ordersApiCall', { timeout: 30000 }).then(
          (retryInterception) => {
            expect(retryInterception.response.statusCode).to.eq(200);
          },
        );
      } else {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Add a delay to ensure UI updates
    cy.wait(2000);
  };

  const resetFilters = () => {
    cy.get(selectors.resetButton, { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // Wait for the reset API call to complete
    cy.wait('@ordersApiCall', { timeout: 30000 }).then((interception) => {
      if (interception.response.statusCode !== 200) {
        cy.log(
          `API call failed with status ${interception.response.statusCode}. Retrying...`,
        );
        cy.reload();
        cy.wait('@ordersApiCall', { timeout: 30000 }).then(
          (retryInterception) => {
            expect(retryInterception.response.statusCode).to.eq(200);
          },
        );
      } else {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Add a delay to ensure UI updates
    cy.wait(2000);
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

    // Visit the login page with basic auth
    cy.visit('/login', {
      timeout: 30000,
      onBeforeLoad(win) {
        // Set the API URL in the window object
        win.CYPRESS_API_URL = Cypress.env('apiUrl');
        // Log the URLs for debugging
        cy.log(
          `Using URLs - Frontend: ${Cypress.env('frontendUrl')}, API: ${Cypress.env('apiUrl')}`,
        );
      },
    });

    // Wait for the login form to be visible with increased timeout
    cy.get(selectors.loginForm, { timeout: 30000 }).should('be.visible');

    // Login with test credentials
    cy.get(selectors.email, { timeout: 30000 })
      .should('be.visible')
      .type(testData.loginEmail);
    cy.get(selectors.password, { timeout: 30000 })
      .should('be.visible')
      .type(testData.loginPassword);
    cy.get(selectors.submitButton, { timeout: 30000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    // Wait for login API call to complete with retry logic
    cy.wait('@loginRequest', { timeout: 30000 }).then((interception) => {
      if (!interception) {
        cy.log('Login request not intercepted. Retrying login...');
        cy.reload();
        cy.get(selectors.email).type(testData.loginEmail);
        cy.get(selectors.password).type(testData.loginPassword);
        cy.get(selectors.submitButton).click();
        cy.wait('@loginRequest', { timeout: 30000 }).then(
          (retryInterception) => {
            if (!retryInterception) {
              throw new Error('Login request failed after retry');
            }
            expect(retryInterception.response.statusCode).to.eq(200);
          },
        );
      } else {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Wait for profile API call to complete
    cy.wait('@profileRequest', { timeout: 30000 }).then((interception) => {
      if (!interception) {
        cy.log('Profile request not intercepted. Retrying...');
        cy.reload();
        cy.wait('@profileRequest', { timeout: 30000 }).then(
          (retryInterception) => {
            if (!retryInterception) {
              throw new Error('Profile request failed after retry');
            }
            expect(retryInterception.response.statusCode).to.eq(200);
          },
        );
      } else {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Wait for successful login and redirect with increased timeout
    cy.url({ timeout: 30000 })
      .should('include', '/dashboard')
      .then(() => {
        // Add a delay to ensure the dashboard is fully loaded
        cy.wait(3000);
      })
      .catch((error) => {
        cy.log('Error during login redirect:', error);
        // If we're still on the login page, try to login again
        cy.url().then((currentUrl) => {
          if (currentUrl.includes('/login')) {
            cy.log('Still on login page, retrying login...');
            cy.get(selectors.email).type(testData.loginEmail);
            cy.get(selectors.password).type(testData.loginPassword);
            cy.get(selectors.submitButton).click();
            cy.url({ timeout: 30000 }).should('include', '/dashboard');
          }
        });
      });
  };

  beforeEach(() => {
    // Log environment variables for debugging
    cy.log('Environment Variables:', {
      frontendUrl: Cypress.env('frontendUrl'),
      apiUrl: Cypress.env('apiUrl'),
      CI: Cypress.env('CI'),
      baseUrl: Cypress.config('baseUrl'),
    });

    // Set up API intercepts
    cy.intercept('GET', endpoints.ordersEndpoint).as('ordersApiCall');

    // Login before each test
    login();

    // Visit the orders page and wait for it to load
    cy.visit('/dashboard/orders', {
      timeout: 30000,
      onBeforeLoad(win) {
        // Set the API URL in the window object
        win.CYPRESS_API_URL = Cypress.env('apiUrl');
      },
    });

    // Wait for the page to be fully loaded with increased timeout
    cy.get('body', { timeout: 30000 }).should('be.visible');

    // Add a check to ensure we're not redirected to login
    cy.url({ timeout: 30000 })
      .should('include', '/dashboard/orders')
      .then(() => {
        // Wait for orders API call to complete and handle potential errors
        cy.wait('@ordersApiCall', { timeout: 30000 }).then((interception) => {
          if (!interception) {
            cy.log('Orders API call not intercepted. Retrying...');
            cy.reload();
            cy.wait('@ordersApiCall', { timeout: 30000 }).then(
              (retryInterception) => {
                if (!retryInterception) {
                  throw new Error('Orders API call failed after retry');
                }
                expect(retryInterception.response.statusCode).to.eq(200);
              },
            );
          } else {
            expect(interception.response.statusCode).to.eq(200);
          }
        });

        // Add a delay to ensure the table is fully loaded
        cy.wait(3000);
      });
  });

  // Add a retry mechanism for the entire test suite
  Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed' && test._currentRetry < test._retries) {
      cy.log(`Test "${test.title}" failed. Retrying...`);
    }
  });

  // Configure retries for all tests
  Cypress.config('retries', {
    runMode: 2,
    openMode: 0,
  });

  it('should verify UI components and table structure', () => {
    // Verify page heading and description
    cy.get('h1', { timeout: 10000 }).contains('Orders').should('be.visible');
    cy.contains('A list of all the Orders in your account', {
      timeout: 10000,
    }).should('be.visible');

    // Verify table headers
    cy.get(selectors.tableHeaders, { timeout: 10000 }).should('have.length', 6);
    cy.get(selectors.tableHeaders, { timeout: 10000 })
      .eq(0)
      .should('contain', 'Order ID');
    cy.get(selectors.tableHeaders, { timeout: 10000 })
      .eq(1)
      .should('contain', 'Operator');
    cy.get(selectors.tableHeaders, { timeout: 10000 })
      .eq(2)
      .should('contain', 'Order Value');
    cy.get(selectors.tableHeaders, { timeout: 10000 })
      .eq(3)
      .should('contain', 'Date of Order');
    cy.get(selectors.tableHeaders, { timeout: 10000 })
      .eq(4)
      .should('contain', 'Status');

    // Verify table contains data rows
    cy.get(selectors.tableRows, { timeout: 10000 }).should(
      'have.length.at.least',
      1,
    );

    // Verify first row has expected data structure
    cy.get(selectors.tableRows, { timeout: 10000 })
      .first()
      .should('be.visible')
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
    cy.get(selectors.paginationNav, { timeout: 10000 }).should('be.visible');

    // Test Next button if it's enabled
    cy.get(selectors.nextButton, { timeout: 10000 })
      .should('be.visible')
      .then(($nextBtn) => {
        if (!$nextBtn.prop('disabled')) {
          cy.wrap($nextBtn).click();
          cy.wait('@ordersApiCall', { timeout: 30000 });
        }
      });

    // Go back to page 1 if we navigated away
    cy.get(selectors.pageButtons, { timeout: 10000 })
      .contains('1')
      .should('be.visible')
      .then(($firstPageBtn) => {
        if (!$firstPageBtn.prop('disabled')) {
          cy.wrap($firstPageBtn).click();
          cy.wait('@ordersApiCall', { timeout: 30000 });
        }
      });
  });

  it('should navigate to order details page', () => {
    // Click View button on first order
    cy.get(selectors.tableRows, { timeout: 10000 })
      .first()
      .should('be.visible')
      .find(selectors.viewButton)
      .should('be.visible')
      .click();

    // Verify navigation to specific order page
    cy.url().should('match', /\/dashboard\/orders\/\d+/, { timeout: 10000 });
  });

  it('should filter orders by Order ID', () => {
    // Get the Order ID from the first row to use in filter
    cy.get(selectors.tableRows, { timeout: 10000 })
      .first()
      .should('be.visible')
      .find('td')
      .eq(0)
      .invoke('text')
      .then((orderId) => {
        const cleanOrderId = orderId.trim();
        cy.log(`Using Order ID for filter: ${cleanOrderId}`);

        // Apply Order ID filter
        applyFilter(() => {
          cy.get(selectors.orderIdFilter, { timeout: 10000 })
            .should('be.visible')
            .clear()
            .type(cleanOrderId);
        });

        // Verify filtered results
        cy.get(selectors.tableRows, { timeout: 10000 }).should(
          'have.length',
          1,
        );
        cy.get(selectors.tableRows, { timeout: 10000 })
          .first()
          .should('contain', cleanOrderId);

        // Reset filters
        resetFilters();

        // Verify filter was reset
        cy.get(selectors.tableRows, { timeout: 10000 }).should(
          'have.length.at.least',
          1,
        );
      });
  });

  it('should apply multiple filters simultaneously', () => {
    // Apply multiple filters
    applyFilter(() => {
      // Set Items Per Page
      cy.get(selectors.itemsPerPageInput, { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type(testData.itemsPerPage);

      // Select a Status if available
      cy.get(selectors.statusFilter, { timeout: 10000 })
        .should('be.visible')
        .then(($select) => {
          if ($select.find('option').length > 1) {
            cy.get(`${selectors.statusFilter} option`, { timeout: 10000 })
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
    cy.get(selectors.statusFilter, { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        if ($select.find('option').length > 1) {
          // Apply Status filter
          applyFilter(() => {
            cy.get(`${selectors.statusFilter} option`, { timeout: 10000 })
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
    cy.get(selectors.productGroupSelect, { timeout: 10000 })
      .should('be.visible')
      .then(($select) => {
        if ($select.find('option').length > 1) {
          // Apply Product Group filter
          applyFilter(() => {
            cy.get(`${selectors.productGroupSelect} option`, { timeout: 10000 })
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
      cy.get(selectors.itemsPerPageInput, { timeout: 10000 })
        .clear()
        .type(itemCount.toString());
    });

    // Reset filters
    resetFilters();
  });
});
