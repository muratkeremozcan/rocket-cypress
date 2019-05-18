/// <reference types="Cypress" />
import { searchBtn } from './../support/main-page.helper';

Cypress._.times(2, () => {
describe('search', function () {

  before(function () {
    cy.uiLogin();
  });
  context('state: login and fill in the forms', function () {
    
    it('should trigger search and get at least 1 result (if possible)', function () {
      // you may pass in a custom destination as the 1st parameter (or any custom parameter for other arguments)
        // Tokyo Japan seems to give less search results, that can be a good test of 'No results found'
      cy.fillSearchForm();
      searchBtn().should('be.visible').click();

      cy.wait('@destination', { timeout: 15000 });
      // for this timeout we need a System NFR requirement indicating how fast the search results should appear
      // setting it to high timeout because we do not want the tests to fail intermittently
      cy.log('assert on the search result page');
      cy.url().should('include', 'search');

      // the oracle is uncertain; there can be results or no results. For this we have to resort to conditional testing only assert if there are results
      cy.get('.hotel-result-container').then(searchResults => {
        // only check for results if there are any existing, we guarantee this by confirming the absence of no results container
        if (!(searchResults.find('.no-results-message-container').length)) {
          Cypress.log({
            name: 'Found at least 1 results, will assert'
          });
          cy.get('.hotel-result-container > ')
            .its('length')
            .should('be.gte', 1);
        } else {
          Cypress.log({
            name: 'Search did not yield results, no assertions were made'
          });
        }

      });

    });

  });

});
});
