describe('OTP Form Tests', () => {
    beforeEach(() => {
      cy.visit('/login'); // Assuming login takes you to OTP if required
    });
  
    it('should render OTP input form when required', () => {
      cy.contains('Please enter OTP to continue.').should('exist');
      cy.get('input[type="text"]').should('exist');
      cy.get('button').contains('Submit').should('exist');
    });
  
    it('should not allow empty OTP submission', () => {
      cy.get('button').contains('Submit').click();
      cy.contains('Failed to verify OTP. Please try again later.').should('exist');
    });
  
    it('should submit OTP successfully', () => {
      cy.intercept('POST', '**/check-2fa', {
        statusCode: 200,
        body: { status: 'success' },
      }).as('verifyOtp');
  
      cy.get('input[type="text"]').type('123456');
      cy.get('button').contains('Submit').click();
  
      cy.wait('@verifyOtp').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/dashboard');
    });
  
    it('should show error on incorrect OTP', () => {
      cy.intercept('POST', '**/check-2fa', {
        statusCode: 400,
        body: { message: 'Invalid OTP' },
      }).as('verifyOtpFailed');
  
      cy.get('input[type="text"]').type('654321');
      cy.get('button').contains('Submit').click();
  
      cy.wait('@verifyOtpFailed');
      cy.contains('The OTP code is incorrect. Please try again.').should('exist');
    });
  });
  