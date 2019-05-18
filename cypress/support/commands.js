
import { internet } from 'faker';
import * as mainPage from './main-page.helper';
const destinations = require('../fixtures/destinations.json');
const rewardPrograms = require('../fixtures/rewardPrograms.json');


/* 
login: ideally you want to use a facebook test user to login to this application, 
but facebook test users are app-specific and need to be created by the dev of the application
https://www.facebook.com/whitehat/accounts/ 
also you want to login ONLY once using the UI in an isolated test and get 100% confidence UI login works
After that, use api login for any other test: do not repeat the UI login through tests. This slows things down and adds no value
send a POST request to the facebook endpoint with the test user payload 
https://docs.cypress.io/guides/references/best-practices.html#article

TL,DR; It is more realistic to use faker library for UI login and facebook test user for api login
*/
export function uiLogin() {


  const userEmail = internet.email();

  // the api route waits are to stabilize test and ensure flake free execution in any environment
  // note that this scenario can be api tested in isolation, it is best to utilize the FB test user in that workflow
  cy.server();
  cy.route('/rest/defaultCurrency**').as('currency');
  cy.route('POST', '/rest/users/email**').as('postUserData');
  cy.route('/rest/users/*/referralSummary**').as('referral');

  cy.visit('/');
  cy.wait('@currency', { timeout: 15000 });

  mainPage.signUpDialog().should('be.visible', { timeout: 10000 });
  mainPage.emailField().type(userEmail);
  mainPage.signUpBtn().click();
  cy.wait('@postUserData');

  cy.wait('@referral');
  mainPage.signUpDialog().should('not.be.exist');

  mainPage.consentCookies().click();

}

/** get the json data into an array and randomize */
export const randomizeData = jsonData => {
  const arrayOfData = Object.keys(jsonData).map(index => jsonData[index]);
  const randomSelection = arrayOfData[Math.floor(Math.random() * arrayOfData.length)];
  return randomSelection;
}
/** we need the random number to start at 1 for these, unlike the json indexes */
export const randomNumUpTo = num => 1 + Math.floor(Math.random() * `${num}`);

const MAX_ROOMS = 3,
MAX_GUESTS = 5,
destinationData = randomizeData(destinations),
rewardData = randomizeData(rewardPrograms),
guestData = randomNumUpTo(MAX_GUESTS),
roomData = randomNumUpTo(MAX_ROOMS);
/* 
  Here we chose to include assertions in the function because we need insurance that everything will work
    as we setup the base state of the application. 
    like login this function will also be utilized to setup state for other tests
    For these reasons we confidently include the assertions here
    In Cypress this is a best practice, and there is no downside because the logging mechanism is indifferent to failure diagnosis  
*/
// note to use of default parameters. If a parameter is not specified, a randomized value will be passed in
// if you need to do form validation, leave out fields, you can utilized the packaged functions that this function uses
export function fillSearchForm(destination = destinationData , rewardProgram = rewardData, numGuests = guestData, numRooms = roomData) {
    cy.selectDestination(destination);
    
    mainPage.destination().next().should('contain', destination, { timeout: 10000 });
    // ensure that the destination is valid, otherwise we have error popup
    mainPage.errorContent().should('not.exist');

    // verify that we are not getting the 'Please choose a valid reward program' popup
    cy.selectRewards(rewardProgram);
    mainPage.errorContent().should('not.exist');
    
    // drop downs are more idempotent in data checks since there are a limited amount of possible values, ok to assert as such:
    selectGuests(numGuests);
    mainPage.guests().should('contain', numGuests);

    selectRooms(numRooms);
    mainPage.rooms().should('contain', numRooms);

    // leave start date default for basic sanity
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

}

/* 
  there are multiple ways to approach the destinations, and there are constrains
  faker.js could be used, however rewards may not exist for any random location
  faker.js could be limited a certain subset, however that still has a chance of not having rewards; test reliability is not guaranteed
  the ultimate way is to get the destination data from the back-end and randomize the destination based on that
  for our small-scale test goal we will create our own json file and randomize the selection from there
  should include 1 click-nav scenario with 'Current location' because that is an edge case
 
  note that local destination is prime candidate for programmatic login with the api because of the location allow permissions being asked
  populating the load data with current location should be covered in that scenario; current location should be utilized instead of selecting a destination
 */
export function selectDestination(destination = destinationData) {
  // define api routes to wait on, use them to eliminate flake in tests
  cy.server();
  cy.route('/rest/regions*').as('destination');
  // the fields have to be typed slowly to replicate ux and avoid the 'type slowly' error
  cy.log('destination selection');
  mainPage.destination().clear().type(destination, { delay: 150 })
  cy.wait('@destination', {timeout: 10000});
  mainPage.destination().type('{downarrow}{enter}');
}

export function selectRewards(rewardProgram = rewardData) {
  cy.log('reward selection');
  mainPage.rewardProgram().clear().type(rewardProgram).type('{downarrow}{enter}');
}

export function selectGuests(numGuests) {
  cy.log('guest selection');
  mainPage.guests().click();
  mainPage.guestDropdown().should('be.visible');
  mainPage.n_guests(numGuests).click();
}

export function selectRooms(numRooms) {
  cy.log('room selection');
  mainPage.rooms().click();
  mainPage.roomDropdown().should('be.visible');
  mainPage.n_rooms(numRooms).click();
}

/** date end : for happy path, select the next date available in the next month. Clicking in the center of the widget enables this */
export function populateEndDate() {
  cy.log('populate end date');
  mainPage.checkOutDate().click();
  mainPage.calendar().should('be.visible').click();
  mainPage.calendarNext().click();
  mainPage.calendar().click();

}


Cypress.Commands.add('uiLogin', uiLogin);
Cypress.Commands.add('fillSearchForm', fillSearchForm);
Cypress.Commands.add('selectDestination', selectDestination);
Cypress.Commands.add('selectRewards', selectRewards);
Cypress.Commands.add('selectGuests', selectGuests);
Cypress.Commands.add('selectRooms', selectRooms);
Cypress.Commands.add('populateEndDate', populateEndDate);
Cypress.Commands.add('randomizeData', randomizeData);
Cypress.Commands.add('randomNumUpTo', randomNumUpTo);
