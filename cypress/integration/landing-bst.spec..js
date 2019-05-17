/// <reference types="Cypress" />

describe('Initial login and form fill', function () {

  before('should login with a randomly generated email', function () {
    // asynchronously import json data for a suite of destinations and reward programs
    // they will be used as a property of 'this'
    // be careful with lexical scope: use function() instead of arrow function when doing this
    cy.fixture('destinations').as('destinations');
    cy.fixture('rewardPrograms').as('rewardPrograms');
    cy.uiLogin();
  });

  context('Landing page', function () {

    it('should verify url and title', function () {
      cy.url().should('include', 'rocketmiles');
      cy.get('.rm-logo').should('exist').and('be.visible');
    });

    it('should populate the fields randomly and assert them isolation', function () {
      const MAX_ROOMS = 3,
        MAX_GUESTS = 5,
        destinationData = randomizeData(this.destinations),
        rewardData = cy.randomizeData(this.rewardPrograms),
        guestData = cy.randomNumUpTo(MAX_GUESTS),
        roomData = cy.randomNumUpTo(MAX_ROOMS);
      cy.fillSearchForm(destinationData, rewardData, guestData, roomData);
    })

  });

});
