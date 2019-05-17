
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

export function fillSearchForm(destination, rewardProgram, numGuests, numRooms) {

  selectDestination(destination);

  selectRewards(rewardProgram);

  selectGuests(numGuests);

  selectRooms(numRooms);

  // date begin : leave this as default (current date) for happy path
  // you can set current time to a certain date with momentJS, however it is unknown how this will effect the search oracle,
  // perhaps stabilizing time and stubbing the search results is an appropriate api test test for branch executions
  // because, if you think about it, time is the only variable among all fields that cannot be constant

  populateEndDate();

}


// note that local destination is prime candidate for programmatic login with the api because of the location allow permissions being asked
// populating the load data with current location should be covered in that scenario; current location should be utilized instead of selecting a destination
export function selectDestination(destination) {
  // define api routes to wait on, use them to eliminate flake in tests
  cy.server();
  cy.route('/rest/regions**').as('restCall');

  // the fields have to be typed slowly to replicate ux and avoid the 'type slowly' error
  cy.log('destination selection');
  mainPage.destination().clear().type(destination, { delay: 60 }).type('{enter}');
  cy.wait('@restCall');
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



Cypress.Commands.add('uiLogin', uiLogin);
Cypress.Commands.add('fillSearchForm', fillSearchForm);
Cypress.Commands.add('selectDestination', selectDestination);
Cypress.Commands.add('selectRewards', selectRewards);
Cypress.Commands.add('selectGuests', selectGuests);
Cypress.Commands.add('selectRooms', selectRooms);
Cypress.Commands.add('populateEndDate', populateEndDate);
