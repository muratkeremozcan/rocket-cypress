/// <reference types="Cypress" />
import { destination, rewardProgram, searchBtn, errorContent } from '../support/main-page.helper';

describe('Landing page BST', () => {
  Cypress.env('RETRIES', 3);
  context('Build confidence in Login and Form Fill', () => {
    before('should login with a randomly generated email', () => {
      cy.uiLogin();
    });

    it('should verify url and title', () => {
      cy.url().should('include', 'rocketmiles');
      cy.get('.rm-logo').should('exist').and('be.visible');
      cy.percySnapshot('Landing Snapshot');
    });

    it('should populate the fields randomly and assert them in isolation', () => {
      cy.fillSearchForm();
    })

  });
  context('Should perform negative testing on the fields', () => {
    before('should login and fill form', () => {
      // due to the randomly generated data for the fields, it is valuable to run this test more than once
      // here we are not only filling the field but also using the resulting oracle as a test state for negative testing of the 2 fields
      // ideally this form fill should be accomplished with a POST (did not have time to implement it)
      cy.uiLogin();
      cy.fillSearchForm();
    });

    it('should take out destination field, proceed to search and verify the error pop up', () => {
      destination().clear();
      searchBtn().should('be.visible').click();
      errorContent().should('be.visible');
      // cleanup: reset state by filling the field back in so other fields can be tested
      cy.selectDestination();
    });

    it('should take out rewards field, proceed to search and verify the error pop up', () => {
      rewardProgram().clear();
      searchBtn().should('be.visible').click();
      errorContent().should('be.visible');
      cy.selectRewards();
    });
    // no negative testing for rooms and number of people
    /* 
      note: there can be a number of calendar widget date picking tests written to be tested in isolation
      invalid dates, numerics only, prev & next month discrepancies, US vs EU format etc.
    
      the most complete scenario would be to parameterize year, month, date, use combinatorial testing for data driven coverage 
      utilize equivalence partitioning and boundary values for date intervals
      one key ingredient here would be to enter dates as a string in the expected format, this means a post request in an api test is desirable
      we will leave this for a later time 
    
      Here is the combinatorial test model for reference:
      Model Calendar
        Parameters:
          month : { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec }
          day:  { 1, 10, 28, 29, 30, 31, 32 }
          year : { 2019, 2020 }
          
      Paste into https://foselab.unibg.it/ctwedge/, generate CSV, convert to JSON and utilize for data driven testing
      */
  });

});