/// <reference types="Cypress" />

context('Login tests', () => {

  before(() => {
    cy.uiLogin();
  });

  const destinationPicker = () => cy.get('.tt-input');
  const rewardPicker = () => cy.get('.tt-input');

  it('should login', () => {
    cy.log('I have logged in!');
  });

  it('should submit a search form', () => {

  });
});
