describe('Login Page Tests', () => {
    beforeEach(() => {
      cy.visit('https://user:7mCbeCHaWarbCgJO0e@dev.b2b.hksglobal.group/login');
    });
  
    it('should render the login form initially', () => {
      cy.get('h2').contains('Sign in to your account').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').contains('Sign in').should('exist');
    });
  
    it('should attempt login and display OTP form if necessary', () => {
      cy.intercept('POST', '**/oauth/token', {
        statusCode: 200,
        body: {
          access_token: 'fake_token',
          refresh_token: 'fake_refresh',
          expires_in: 3600,
        },
      }).as('loginRequest');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  
      // If OTP is required
      cy.contains('Please enter OTP to continue.').should('exist');
      cy.get('input[type="text"]').should('exist');
    });
  
    it('should successfully verify OTP and redirect to dashboard', () => {
      cy.intercept('POST', '**/check-2fa', {
        statusCode: 200,
        body: { status: 'success' },
      }).as('verifyOtp');
  
      cy.get('input[type="text"]').type('123456');
      cy.get('button').contains('Submit').click();
  
      cy.wait('@verifyOtp').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/dashboard');
    });
  
    it('should show error message on incorrect OTP', () => {
      cy.intercept('POST', '**/check-2fa', {
        statusCode: 400,
        body: { message: 'Invalid OTP' },
      }).as('verifyOtpFailed');
  
      cy.get('input[type="text"]').type('000000');
      cy.get('button').contains('Submit').click();
  
      cy.wait('@verifyOtpFailed');
      cy.contains('The OTP code is incorrect. Please try again.').should('exist');
    });
  });
  