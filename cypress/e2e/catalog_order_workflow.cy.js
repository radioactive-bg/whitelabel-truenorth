// cypress/e2e/catalog.spec.js
describe('Catalog Page Tests', () => {
  // Common selectors
  const selectors = {
    productGrid: '.grid-cols-2',
    productButton: '.grid-cols-2 button',
    productsTable: 'table',
    tableRows: 'tbody tr',
    filterButtons: '.hidden.lg\\:block .items-center button',
    popover: '.absolute',
    checkboxes: '.absolute input[type="checkbox"]',
    loginForm: 'form',
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
  };

  // API endpoints
  const endpoints = {
    loginEndpoint: '**/oauth/token',
    profileEndpoint: '**/distributor-crm/v1/profile',
    regionsEndpoint: '**/distributor-crm/v1/filters/regions',
    currenciesEndpoint: '**/distributor-crm/v1/filters/currencies',
    productGroupsEndpoint: '**/distributor-crm/v1/product-groups**',
    productPreviewEndpoint: '**/distributor-crm/v1/price-list/preview**',
  };

  // Common verification functions
  const verifyProductData = () => {
    cy.get(selectors.tableRows, { timeout: 10000 })
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('img').should('be.visible');
        cy.get('td').should('have.length.at.least', 3);
        cy.contains(/\d+(\.\d+)?/).should('be.visible');
        cy.get('input[type="number"]').should('be.visible');
        cy.get('td')
          .contains(/In Stock|Sold Out/)
          .should('be.visible');
        cy.contains('button', 'Add').should('be.visible');
      });
  };

  const waitForApiCalls = () => {
    // Increase timeout for CI environment
    const timeout = Cypress.env('CI') ? 60000 : 30000;
    cy.wait(
      ['@regionsApiCall', '@currenciesApiCall', '@productGroupsApiCall'],
      { timeout },
    ).then((interceptions) => {
      interceptions.forEach((interception) => {
        if (interception.response.statusCode !== 200) {
          throw new Error(
            `API call failed with status ${interception.response.statusCode}`,
          );
        }
      });
    });
  };

  const selectFilterOption = (filterIndex, optionIndex = 0) => {
    // Open the filter popover by index
    cy.get(selectors.filterButtons, { timeout: 10000 })
      .eq(filterIndex)
      .should('be.visible')
      .click();

    // Wait for popover to open with increased timeout
    cy.get(selectors.popover, { timeout: 10000 }).should('be.visible');

    // Select the option by index
    cy.get(selectors.checkboxes, { timeout: 10000 })
      .eq(optionIndex)
      .should('be.visible')
      .click();

    // Close the popover by clicking outside
    cy.get('body').click(0, 0);
  };

  const login = () => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Set up API intercepts for login
    cy.intercept('POST', endpoints.loginEndpoint).as('loginRequest');
    cy.intercept('GET', endpoints.profileEndpoint).as('profileRequest');

    // Visit the login page
    cy.visit('http://localhost:3000/login');

    // Wait for the login form to be visible with increased timeout
    cy.get(selectors.loginForm, { timeout: 10000 }).should('be.visible');

    // Login with test credentials
    cy.get(selectors.emailInput, { timeout: 10000 })
      .should('be.visible')
      .type(Cypress.env('TEST_EMAIL'));
    cy.get(selectors.passwordInput, { timeout: 10000 })
      .should('be.visible')
      .type(Cypress.env('TEST_PASSWORD'));
    cy.get(selectors.submitButton, { timeout: 10000 })
      .should('be.visible')
      .click();

    // Wait for login API call to complete
    cy.wait('@loginRequest', { timeout: 30000 }).then((interception) => {
      if (interception.response.statusCode !== 200) {
        throw new Error(
          `Login failed with status ${interception.response.statusCode}`,
        );
      }
    });

    // Wait for profile API call to complete
    cy.wait('@profileRequest', { timeout: 30000 }).then((interception) => {
      if (interception.response.statusCode !== 200) {
        throw new Error(
          `Profile fetch failed with status ${interception.response.statusCode}`,
        );
      }
    });

    // Wait for successful login and redirect with increased timeout
    cy.url().should('include', '/dashboard', { timeout: 30000 });

    // Add a small delay to ensure the dashboard is fully loaded
    cy.wait(3000);
  };

  beforeEach(() => {
    // Set up API intercepts
    cy.intercept('GET', endpoints.regionsEndpoint).as('regionsApiCall');
    cy.intercept('GET', endpoints.currenciesEndpoint).as('currenciesApiCall');
    cy.intercept('GET', endpoints.productGroupsEndpoint).as(
      'productGroupsApiCall',
    );
    cy.intercept('GET', endpoints.productPreviewEndpoint).as(
      'productPreviewCall',
    );

    // Login before each test
    login();

    // Visit the catalog page and wait for it to load
    cy.visit('http://localhost:3000/dashboard/catalog');

    // Wait for the page to be fully loaded with increased timeout
    cy.get('body', { timeout: 10000 }).should('be.visible');

    // Add a check to ensure we're not redirected to login
    cy.url().should('include', '/dashboard/catalog', { timeout: 20000 });
  });

  it('should show skeleton loading state and then display product groups', () => {
    // Verify skeleton loading state
    cy.get('.rounded', { timeout: 10000 }).should('be.visible');

    // Wait for API calls to complete
    waitForApiCalls();

    // Verify product grid content
    cy.get(selectors.productGrid, { timeout: 10000 }).should('be.visible');
    cy.get(selectors.productButton, { timeout: 10000 }).should(
      'have.length.at.least',
      1,
    );

    // Verify first product has expected elements
    cy.get(selectors.productButton)
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('img').should('be.visible');
        cy.get('h3').should('be.visible');
      });
  });

  it('should filter products by clicking on product group', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Click on the first product group
    cy.get(selectors.productButton, { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();

    // Wait for product data to load
    cy.get(selectors.productsTable, { timeout: 10000 }).should('be.visible');

    // Verify products are displayed
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);
    waitForApiCalls();

    // Verify product data
    verifyProductData();

    // Check URL contains the selected product group
    cy.url().should('include', 'ProductGroups=');
  });

  it('should filter products using Product Group filter with multiple selections', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Open Product Group filter and select multiple options
    cy.get(selectors.filterButtons, { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();
    cy.get(selectors.popover).should('be.visible');

    // Select first two options
    cy.get(selectors.checkboxes).first().click();
    cy.get(selectors.checkboxes).eq(1).click();

    // Wait for product data to load
    cy.get(selectors.productsTable, { timeout: 10000 }).should('be.visible');

    // Verify products are displayed
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();

    // Check URL contains the filter parameter
    cy.url().should('include', 'ProductGroups=');
  });

  it('should filter products using Activation Region filter', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Select the first option from the Activation Region filter
    selectFilterOption(1);

    // Wait for product data to load
    cy.get(selectors.productsTable, { timeout: 10000 }).should('be.visible');

    // Verify URL and product display
    cy.url().should('include', 'ActivationRegions=');
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();
  });

  it('should filter products using Denomination Currency filter', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Select the first option from the Denomination Currency filter
    selectFilterOption(2);

    // Wait for product data to load
    cy.get(selectors.productsTable, { timeout: 10000 }).should('be.visible');

    // Verify URL and product display
    cy.url().should('include', 'DenominationCurrencys=');
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();
  });

  it('should complete a full order workflow from catalog to checkout', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Click on the first product group
    cy.get(selectors.productButton, { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();

    // Wait for product data to load
    cy.get(selectors.productsTable, { timeout: 10000 }).should('be.visible');

    // Increase quantity
    cy.get('input[type="number"]')
      .first()
      .should('be.visible')
      .then(($input) => {
        cy.wrap($input).click();
        cy.wrap($input).type('{uparrow}');
        cy.wrap($input).type('{uparrow}');
        cy.wrap($input).trigger('change');
      });

    // Click Add button for the first product
    cy.get('button').contains('Add').first().should('be.visible').click();

    // Click on the cart icon in the navbar
    cy.get('#ShoppingBagIconButton', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verify cart modal is open
    cy.get('h2')
      .contains('Shopping Cart', { timeout: 10000 })
      .should('be.visible');

    // Click Continue to Payment
    cy.get('#ContinueToPaymentButton').should('be.visible').click();

    // Verify we're on the checkout page
    cy.url().should('include', '/dashboard/checkout', { timeout: 10000 });

    // Click Confirm Order button
    cy.get('button').contains('Confirm order').should('be.visible').click();

    // Wait for order processing
    cy.url().should('include', '/dashboard/checkout/payment', {
      timeout: 10000,
    });

    // Wait for redirect to download codes page
    cy.url().should('include', '/dashboard/checkout/downloadCodes', {
      timeout: 10000,
    });
  });
});
