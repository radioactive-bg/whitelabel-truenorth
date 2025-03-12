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
  };

  // Common verification functions
  const verifyProductData = () => {
    cy.get(selectors.tableRows)
      .first()
      .within(() => {
        cy.get('img').should('be.visible');
        cy.get('td').should('have.length.at.least', 3);
        cy.contains(/\d+(\.\d+)?/).should('be.visible');
        cy.get('input[type="number"]').should('be.visible');
        cy.get('td')
          .contains(/In Stock|Sold Out/)
          .should('be.visible');
        cy.contains('button', 'Add').should('exist');
      });
  };

  const waitForApiCalls = () => {
    cy.wait(
      ['@regionsApiCall', '@currenciesApiCall', '@productGroupsApiCall'],
      { timeout: 30000 },
    );
  };

  const selectFilterOption = (filterIndex, optionIndex = 0) => {
    // Open the filter popover by index
    cy.get(selectors.filterButtons).eq(filterIndex).click();

    // Wait for popover to open
    cy.get(selectors.popover).should('be.visible');

    // Select the option by index
    cy.get(selectors.checkboxes).eq(optionIndex).click();

    // Close the popover by clicking outside
    cy.get('body').click(0, 0);
  };

  beforeEach(() => {
    // Set up API intercepts
    cy.intercept('GET', '**/distributor-crm/v1/filters/regions').as(
      'regionsApiCall',
    );
    cy.intercept('GET', '**/distributor-crm/v1/filters/currencies').as(
      'currenciesApiCall',
    );
    cy.intercept('GET', '**/distributor-crm/v1/product-groups**').as(
      'productGroupsApiCall',
    );
    cy.intercept('GET', '**/distributor-crm/v1/price-list/preview**').as(
      'productPreviewCall',
    );

    // Visit the login page with basic auth
    cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');

    // Login with test credentials
    cy.get('input[name="email"]').type('m.petkov2@radioactive.bg');
    cy.get('input[name="password"]').type('m.petkov2@radioactive.bg');
    cy.get('button[type="submit"]').click();

    // Verify successful login by checking redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.screenshot('after-login-dashboard');

    // Visit the catalog page
    cy.visit(
      'https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/dashboard/catalog',
    );
  });

  it('should show skeleton loading state and then display product groups', () => {
    // Verify skeleton loading state
    cy.get('.rounded').should('be.visible');

    // Wait for API calls to complete
    waitForApiCalls();
    cy.screenshot('catalog-page-loaded');

    // Verify product grid content
    cy.get(selectors.productGrid).should('be.visible');
    cy.get(selectors.productButton).should('have.length.at.least', 1);

    // Verify first product has expected elements
    cy.get(selectors.productButton)
      .first()
      .within(() => {
        cy.get('img').should('be.visible');
        cy.get('h3').should('be.visible');
      });
  });

  it('should filter products by clicking on product group', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Click on the first product group
    cy.get(selectors.productButton).first().click();

    // Wait for product data to load

    // Verify products are displayed
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();

    // Check URL contains the selected product group
    cy.url().should('include', 'ProductGroups=');
    cy.screenshot('catalog-filtered-products');
  });

  it('should filter products using Product Group filter with multiple selections', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Open Product Group filter and select multiple options
    cy.get(selectors.filterButtons).first().click();
    cy.get(selectors.popover).should('be.visible');

    // Select first two options
    cy.get(selectors.checkboxes).first().click();
    cy.get(selectors.checkboxes).eq(1).click();

    // Wait for product data to load

    // Verify products are displayed
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();

    // Check URL contains the filter parameter
    cy.url().should('include', 'ProductGroups=');
    cy.screenshot('catalog-multiple-filters');
  });

  it('should filter products using Activation Region filter', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Select the first option from the Activation Region filter
    selectFilterOption(1);

    // Wait for product data to load

    // Verify URL and product display
    cy.url().should('include', 'ActivationRegions=');
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();
    cy.screenshot('catalog-region-filter');
  });

  it('should filter products using Denomination Currency filter', () => {
    // Wait for API calls to complete
    waitForApiCalls();

    // Select the first option from the Denomination Currency filter
    selectFilterOption(2);

    // Wait for product data to load

    // Verify URL and product display
    cy.url().should('include', 'DenominationCurrencys=');
    cy.get(selectors.productsTable).should('be.visible');
    cy.get(selectors.tableRows).should('have.length.at.least', 1);

    // Verify product data
    verifyProductData();
    cy.screenshot('catalog-currency-filter');
  });
});
