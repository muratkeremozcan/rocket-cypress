
import { internet } from 'faker';
import * as mainPage from './main-page.helper';
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
  cy.wait('@currency');

  mainPage.signUpDialog().should('be.visible');
  mainPage.emailField().type(userEmail);
  mainPage.signUpBtn().click();
  cy.wait('@postUserData');

  cy.wait('@referral');
  mainPage.signUpDialog().should('not.be.exist');

  mainPage.consentCookies().click();

}

/* 
  Here we chose to include assertions in the function because we need insurance that everything will work
    as we setup the base state of the application. 
    like login this function will also be utilized to setup state for other tests
    For these reasons we confidently include the assertions here
    In Cypress this is a best practice, and there is no downside because the logging mechanism is indifferent to failure diagnosis  
*/
export function fillSearchForm(destination, rewardProgram, numGuests, numRooms) {

    // we use siblings() here because the data to assert gets populated in a sibling DOM element
    // we do not use 'pop up does not exist assertion' because there can be multiple types of popups:
    // 'please type slowly' or 'no offers available'
    cy.selectDestination(destination);
    mainPage.destination().siblings().should('contain', destination);
    
    // verify that we are not getting the 'Please choose a valid reward program' popup
    cy.selectRewards(rewardProgram);
    cy.get('.popover-content').should('not.exist');
    
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
export function selectDestination(destination) {
  // define api routes to wait on, use them to eliminate flake in tests
  // cy.server();
  // cy.route('/rest/regions**').as('restCall');

  // the fields have to be typed slowly to replicate ux and avoid the 'type slowly' error
  cy.log('destination selection');
  mainPage.destination().clear().type(destination, { delay: 60 }).type('{enter}');
  // cy.wait('@restCall');
}

export function selectRewards(rewardProgram) {
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
  /* 
    note: there can be exhaustive calendar widget date picking tests written to be tested in isolation
    invalid dates, numerics only, prev & next month discrepancies, US vs EU format etc.

    the most complete scenario would be to parameterize year, month, date, use combinatorial testing for data driven coverage 
    utilize equivalence partitioning and boundary values for date intervals
    one key ingredient here would be to enter dates as a string in the expected format, this means a post request in an api test is desirable
    we will leave this for a later time 

    Here is the combinatorial test model for reference:
    Test Factor |	Number of Values |	Test Factor Values
    Month   |	   12	   | jan feb mar apr may jun jul aug sep oct nov dec
    Day	    |    7	   |  1 10 28 29 30 31 32
    Year	  |    3	  |  2015 2016 2017

    http://testcover.com/pub/calex.php
    Plug into https://foselab.unibg.it/ctwedge/, generate CSV, convert to JSON and utilize for data driven testing
    */
}

/** get the json data into an array and randomize */
export const randomizeData = jsonData => {
  const arrayOfData = Object.keys(jsonData).map(index => jsonData[index]);
  const randomSelection = arrayOfData[Math.floor(Math.random() * arrayOfData.length)];
  return randomSelection;
}
/** we need the random number to start at 1 for these, unlike the json indexes */
export const randomNumUpTo = num => 1 + Math.floor(Math.random() * `${num}`);

Cypress.Commands.add('uiLogin', uiLogin);
Cypress.Commands.add('fillSearchForm', fillSearchForm);
Cypress.Commands.add('selectDestination', selectDestination);
Cypress.Commands.add('selectRewards', selectRewards);
Cypress.Commands.add('selectGuests', selectGuests);
Cypress.Commands.add('selectRooms', selectRooms);
Cypress.Commands.add('populateEndDate', populateEndDate);
Cypress.Commands.add('randomizeData', randomizeData);
Cypress.Commands.add('randomNumUpTo', randomNumUpTo);
