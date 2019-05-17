/// <reference types="Cypress" />
import * as mainPage from '../support/main-page.helper';
import { selectGuests, selectRooms, populateEndDate } from '../support/commands';
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

      // cy.fillSearchForm(destinationData, rewardData, guestData, roomData, true);

      // we use siblings() here because the data to assert gets populated in a sibling DOM element
      // we do not use 'pop up does not exist assertion' because there can be multiple types of popups:
      // 'please type slowly' or 'no offers available'
      cy.selectDestination(destinationData);
      mainPage.destination().siblings().should('contain', destinationData);
      
      // verify that we are not getting the 'Please choose a valid reward program' popup
      cy.selectRewards(rewardData);
      cy.get('.popover-content').should('not.exist');
      
      // drop downs are more idempotent in data checks since there are a limited amount of possible values, ok to assert as such:
      selectGuests(guestData);
      mainPage.guests().should('contain', guestData);

      selectRooms(roomData);
      mainPage.rooms().should('contain', roomData);

      populateEndDate();
      // dig into the DOM to extract the dates in milliseconds and compare them
        // this is 100% swag that this value is related to time. 
        // There could be better value to assert if development could be consulted, we could assert for a certain duration
      mainPage.checkInDate().find('input').invoke('attr', 'id').then(elem1 => {
        // extract the number out of the yielded value
        const regex = /\d+/;
        const checkInDateInMs = elem1.match(regex)[0];

        mainPage.checkOutDate().find('input').invoke('attr', 'id').then(elem2 => {
          const checkOutDateInMs = elem2.match(regex)[0];
          expect(checkOutDateInMs).to.be.greaterThan(checkInDateInMs);
        });
        
      });

    });




  });
});