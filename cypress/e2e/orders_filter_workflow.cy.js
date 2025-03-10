// cypress/e2e/orders-page.cy.js
describe('Orders Page', () => {
  beforeEach(() => {
    // Use cy.session to persist auth state between tests
    cy.session(
      'user-session',
      () => {
        cy.log('Setting up user session');
        performLogin();
      },
      {
        validate: () => {
          // Validate session by checking for token
          cy.window().then((win) => {
            const hasToken = win.localStorage.getItem('access_token');
            expect(hasToken).to.exist;
          });
        },
        cacheAcrossSpecs: true,
      },
    );

    // Navigate to orders page with preserved session
    cy.visit(
      'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/orders',
      {
        timeout: 15000,
      },
    );

    // Wait for API call to complete
    cy.intercept('GET', '**/distributor-crm/v1/orders**').as('ordersApiCall');
    cy.wait('@ordersApiCall', { timeout: 30000 }).then((interception) => {
      cy.log(`API call status: ${interception.response?.statusCode}`);
      if (interception.response?.body) {
        cy.log(
          `API returned ${interception.response.body.data?.length || 0} items`,
        );
      }
    });

    // Verify we're on the orders page
    cy.url().should('include', '/orders');
    cy.get('table[id="orderList"]', { timeout: 15000 }).should('be.visible');
  });

  // Helper function to perform login
  function performLogin() {
    cy.log('Starting login process');

    // Visit login page
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login', {
      timeout: 10000,
    });

    // Login with credentials
    cy.get('input[name="email"]')
      .should('be.visible')
      .clear()
      .type('m.petkov2@radioactive.bg');
    cy.get('input[name="password"]')
      .should('be.visible')
      .clear()
      .type('m.petkov2@radioactive.bg');
    cy.get('button[type="submit"]').should('be.enabled').click();

    // Verify successful login
    cy.url().should('include', '/dashboard', { timeout: 15000 });

    // Verify token is stored
    cy.window().then((win) => {
      const token = win.localStorage.getItem('access_token');
      expect(token).to.exist;
      cy.log(`Token received: ${!!token}`);
    });
  }

  it('should display correct UI components', () => {
    // Check UI components
    cy.contains('h1.text-base', 'Orders').should('be.visible');
    cy.contains('A list of all the Orders in your account').should(
      'be.visible',
    );

    // Check filter section
    cy.contains('label', 'Order ID').should('be.visible');
    cy.contains('label', 'Items on Page').should('be.visible');
    cy.contains('label', 'Date From').should('be.visible');
    cy.contains('label', 'Date To').should('be.visible');
    cy.contains('label', 'Status').should('be.visible');
    cy.contains('label', 'Product Group').should('be.visible');

    // Check buttons
    cy.contains('button', 'Reset').should('be.visible');
    cy.contains('button', 'Filter').should('be.visible');
    cy.get('button[id="filterButton"]').should('exist');

    // Check table headers
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

    // Check pagination
    cy.get('nav').contains('Next').should('exist');
  });

  // Additional test for filtering functionality
  it('should filter orders correctly', () => {
    // Test filter functionality
    cy.get('input[placeholder="Order ID"]').type('12345');
    cy.contains('button', 'Filter').click();

    // Wait for API call with filter
    cy.intercept('GET', '**/distributor-crm/v1/orders**').as(
      'filteredOrdersCall',
    );
    cy.wait('@filteredOrdersCall', { timeout: 20000 });

    // Additional assertions for the filtered results
    // (Customize based on your expected behavior)
  });
});
