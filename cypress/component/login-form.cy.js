describe('Login Form Tests', () => {
    beforeEach(() => {
      cy.visit('/login'); // Adjust based on your actual login page route
    });
  
    it('should render login form correctly', () => {
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').contains('Sign in').should('exist');
    });
  
    it('should not submit the form with empty inputs', () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[name="email"]:invalid').should('exist');
      cy.get('input[name="password"]:invalid').should('exist');
    });
  
    it('should allow inputting email and password', () => {
      cy.get('input[name="email"]').type('test@example.com').should('have.value', 'test@example.com');
      cy.get('input[name="password"]').type('password123').should('have.value', 'password123');
    });
  
    it('should call handleLogin on form submit', () => {
      cy.intercept('POST', '**/oauth/token').as('loginRequest');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    });
  
    it('should show error on invalid credentials', () => {
      cy.intercept('POST', '**/oauth/token', {
        statusCode: 401,
        body: { message: 'Invalid credentials' },
      }).as('loginFailed');
  
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginFailed');
      cy.contains('Failed to login').should('exist');
    });
  });
  