/// <reference types="Cypress" />
import { searchBtn } from './../support/main-page.helper';

describe('search workflow', function () {
  Cypress.env('RETRIES', 3);

  it('should fill out the form, trigger search and assert the results or their absence)', function () {

    cy.uiLogin();
    cy.fillSearchForm('Tokyo, Japan');
    searchBtn().should('be.visible').click();
    cy.wait('@destination', { timeout: 15000 });
    // for this timeout we need a System NFR requirement indicating how fast the search results should appear
    // setting it to high timeout because we do not want the tests to fail intermittently
    cy.log('state: we have logged in, searched and we are asserting the results');
    cy.url().should('include', 'search');

    // the oracle is uncertain; there can be results or no results. For this we have to resort to conditional testing only assert if there are results
    cy.get('.hotel-result-container').then(searchResults => {
      // only check for results if there are any existing, we guarantee this by confirming the absence of no results container
      if (!(searchResults.find('.no-results-message-container').length)) {
        Cypress.log({
          name: 'Found at least 1 result, will assert'
        });
        cy.get('.hotel-result-container > ')
          .its('length')
          .should('be.gte', 1);

        // visual ai snapshot here is experimental, we might need to find a way to tell the system to ignore the different KIND of results that can populate
        // will need to talk to development to find out if there is any value
        // one area to test could be localization, but this was not a requirement. This is to show that these problems are solvable with visual ai
        cy.percySnapshot('Search Result Snapshot');
      } else {
        Cypress.log({
          name: 'Search did not yield results, no assertions were made'
        });
      }
    });

  });

});
