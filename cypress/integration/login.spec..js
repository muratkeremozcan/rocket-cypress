/// <reference types="Cypress" />
import * as mainPage from '../support/main-page.helper';
// const destinations = require('../fixtures/destinations.json');
// const rewardPrograms = require('../fixtures/rewardPrograms.json');

/* 
  there are multiple ways to approach the destinations, and there are constrains
  faker.js could be used, however rewards may not exist for any random location
  faker.js could be limited a certain subset, however that still has a chance of not having rewards; test reliability is not guaranteed
  the ultimate way is to get the destination data from the back-end and randomize the destination based on that
  for our small-scale test goal we will create our own json file and randomize the selection from there
  should include 1 click-nav scenario with 'Current location' because that is an edge case
*/
/** get the json data into an array and randomize */
const randomizeData = jsonData => {
  const arrayOfData = Object.keys(jsonData).map(index => jsonData[index]);
  const randomSelection = arrayOfData[Math.floor(Math.random() * arrayOfData.length)];
  return randomSelection;
}
/** we need the random number to start at 1 for these, unlike the json indexes */
const randomNumUpTo = num => 1 + Math.floor(Math.random() * `${num}`);
const MAX_ROOMS = 3;
const MAX_GUESTS = 5;

describe('Initial login and form fill', function () {

  before('should login with a randomly generated email', function () {
    cy.fixture('destinations').as('destinations');
    cy.fixture('rewardPrograms').as('rewardPrograms');
    cy.uiLogin();
  });

  context('Landing page', function () {

    it('should login', function () {
      cy.url().should('include', 'rocketmiles');
      cy.get('.rm-logo').should('exist').and('be.visible');
      cy.log('I have logged in!');
    });

    it('should perform form data input validation', function () {

      // record the values so they can be asserted against  
      const destinationData = randomizeData(this.destinations), 
            rewardData = randomizeData(this.rewardPrograms), 
            guestData = randomNumUpTo(MAX_GUESTS), 
            roomData = randomNumUpTo(MAX_ROOMS);

      cy.fillSearchForm(destinationData, rewardData, guestData, roomData);

      cy.log('assert form data validity');
      // we use siblings() here because the data to assert gets populated in a sibling DOM element
      // we do not use 'pop up does not exist assertion' because there can be multiple types of popups:
        // 'please type slowly' or 'no offers available'
      mainPage.destination().siblings().should('contain', destinationData);
      // verify that we are not getting the 'Please choose a valid reward program' popup
      cy.get('.popover-content').should('not.exist');
      // drop downs are more idempotent in data checks since there are a limited amount of possible values, ok to assert as such:
      mainPage.guests().should('contain', guestData);
      mainPage.rooms().should('contain', roomData);
    });
  });
});