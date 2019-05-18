/// <reference types="Cypress" />
import { searchBtn } from './../support/main-page.helper';

/**
 * This spec has been isolated from the other search spec for pipeline efficiency
 * The initial execution yielded 1:06 minutes https://dashboard.cypress.io/#/projects/khn1sp/runs/7/specs
 * With 3 parallel CI machines and isolated this test, the pipeline duration was reduced to around half that
 * https://dashboard.cypress.io/#/projects/khn1sp/runs/10/specs
 */
describe('Search workflow: back to back searches', function () {
  Cypress.env('RETRIES', 3);
 
  it('should do 2 searches back to back', function () {
    cy.uiLogin();
    cy.fillSearchForm('Tokyo, Japan');
    searchBtn().should('be.visible').click();
    cy.wait('@destination', { timeout: 15000 });

    cy.log('state: we have logged in, did one search and got results. We are doing a 2nd search ');

    cy.selectDestination();
    cy.selectRewards();

    searchBtn().should('be.visible').click();

    cy.get('.hotel-result-container > ')
      .its('length')
      .should('be.gte', 1);
  });

});
