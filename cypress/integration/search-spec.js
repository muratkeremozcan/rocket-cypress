/// <reference types="Cypress" />
import { searchBtn } from './../support/main-page.helper';

describe('search', function () {

  before('setup state: login and fill in the forms', function () {
    cy.uiLogin();
    cy.fillSearchForm();
  });

  context('Search', function () {

    it('should trigger search and get at least 1 result', function () {
      searchBtn().should('be.visible').click();
      cy.server();
      cy.route('/rest/marketingPlacements**').as('marketing');
      cy.wait('@marketing', { timeout: 15000 });
      
      cy.log('assert on the search result page');
      cy.url().should('include', 'search');
      cy.get('.hotel-result-container > ')
        .its('length')
        .should('be.gte', 1);

    });

  });

});
