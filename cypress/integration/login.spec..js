/// <reference types="Cypress" />
const destinations = require('../fixtures/destinations.json');
const rewardPrograms = require('../fixtures/rewardPrograms.json');

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
  const arrayOfData = Object.keys(jsonData).map( index => jsonData[index] );
  const randomSelection = arrayOfData[Math.floor(Math.random() * arrayOfData.length)];
  return randomSelection;
}
/** we need the random number to start at 1 for these, unlike the json indexes */
const randomNumUpTo = num => 1 + Math.floor(Math.random() * `${num}`);
const MAX_ROOMS = 3;
const MAX_GUESTS = 5;

context('Login tests', () => {

  before('should login with a randomly generated email', () => {
    cy.uiLogin();
  });

  it('should login', () => {
    cy.url().should('include', 'rocketmiles');
    cy.get('.rm-logo').should('exist').and('be.visible');
    cy.log('I have logged in!');
  });

  it('should submit a search form', () => {
    cy.fillSearchForm(
      randomizeData(destinations), 
      randomizeData(rewardPrograms), 
      randomNumUpTo(MAX_GUESTS), 
      randomNumUpTo(MAX_ROOMS));
  });
});
