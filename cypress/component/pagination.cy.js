describe('Pagination Component Tests', () => {
    beforeEach(() => {
      cy.visit('/dashboard/catalog'); // Adjust the route to where pagination is used
    });
  
    it('should render pagination buttons', () => {
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });
  
    it('should disable previous button on first page', () => {
      cy.get('button').contains('Previous').should('be.disabled');
    });
  
    it('should navigate to the next page when Next button is clicked', () => {
      cy.get('button').contains('Next').click();
      cy.url().should('include', 'page=2'); // Assuming page param is in URL
    });
  
    it('should navigate to the previous page when Previous button is clicked', () => {
      cy.get('button').contains('Next').click();
      cy.url().should('include', 'page=2');
  
      cy.get('button').contains('Previous').click();
      cy.url().should('include', 'page=1');
    });
  
    it('should disable next button on last page', () => {
      cy.intercept('GET', '**/products?page=*', {
        statusCode: 200,
        body: { currentPage: 5, totalPages: 5 }, // Simulating last page
      }).as('lastPageData');
  
      cy.reload(); // Reload to apply interception
      cy.wait('@lastPageData');
  
      cy.get('button').contains('Next').should('be.disabled');
    });
  
    it('should highlight the correct current page', () => {
      cy.get('button[aria-current="page"]').should('contain.text', '1');
      cy.get('button').contains('Next').click();
      cy.get('button[aria-current="page"]').should('contain.text', '2');
    });
  });
  