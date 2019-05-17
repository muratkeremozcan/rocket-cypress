/// <reference types="Cypress" />

context('Login tests', () => {

  before(() => {
    cy.uiLogin();
  });

  it('should login', function () {
    cy.log('I have logged in!');

  });
});
