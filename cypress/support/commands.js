
import { internet } from 'faker';

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
  
  const signUpDialog = () => cy.get('.modal-body');
  const emailField = () => cy.get('.row > :nth-child(1) > .form-control');
  const signUpBtn = () => cy.get('.row > :nth-child(2) > .form-control');
  const consentCookies = () => cy.get(':nth-child(2) > .btn');
  const userEmail = internet.email();
  
  cy.visit('/');
  signUpDialog().should('be.visible');
  emailField().type(userEmail);
  signUpBtn().click();
  signUpDialog().should('not.be.exist');
  consentCookies().click();
  
}

const select_destination = () => cy.get('.tt-input');
const select_rewardProgram = () => cy.get('.program-autosuggest-container > .rm-input-base');
const select_dateStart = () => cy.get('#dp1558075576167');
const select_dateEnd = () => cy.get('#dp1558075576168');
const select_guests = () => cy.get('.adults');
const guestDropdown = () => cy.get('.adults > .rm-select-base > .btn-group > .dropdown-menu');
const select_n_guests = numGuests => cy.get(`.adults > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numGuests}) > a`);

const select_rooms = () => cy.get('.rooms');
const roomDropdown = () => cy.get('.rooms > .rm-select-base > .btn-group > .dropdown-menu');
const select_n_rooms = numRooms => cy.get(`.rooms > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numRooms}) > a`);

export function fillSearchForm(destination, rewardProgram, numGuests, numRooms) {
  
  // define api routes to wait on, use them to eliminate flake in tests
  cy.server();
  cy.route('/rest/regions**').as('restCall');

  // the fields have to be typed slowly to replicate ux and avoid the 'type slowly' error
  cy.log('destination selection');
  select_destination().type(destination, {delay: 100}).type('{enter}');
  cy.wait('@restCall');

  cy.log('reward selection');
  select_rewardProgram().type(rewardProgram, {delay: 100}).type('{downarrow}{enter}');
  cy.wait('@restCall');

  cy.log('guest selection');
  select_guests().click();
  guestDropdown().should('be.visible');
  select_n_guests(numGuests).click();

  cy.log('room selection');
  select_rooms().click();
  roomDropdown().should('be.visible');
  select_n_rooms(numRooms).click();
  
  // date begin
  // date end

}


Cypress.Commands.add('uiLogin', uiLogin);
Cypress.Commands.add('fillSearchForm', fillSearchForm);
