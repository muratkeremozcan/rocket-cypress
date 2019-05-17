/// <reference types="Cypress" />

describe('Landing page BST', () => {

  before('should login with a randomly generated email', () => {
    cy.uiLogin();
  });

  context('Build confidence in Login and Form Fill', () => {

    it('should verify url and title', () => {
      cy.url().should('include', 'rocketmiles');
      cy.get('.rm-logo').should('exist').and('be.visible');
    });

    it('should populate the fields randomly and assert them isolation', () => {
      cy.fillSearchForm();
    })

  });

});
