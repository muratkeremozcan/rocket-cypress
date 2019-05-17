
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

// export const mainPage..destination = () => cy.get('.tt-input');


export function fillSearchForm(destination, rewardProgram, numGuests, numRooms) {
  
  // define api routes to wait on, use them to eliminate flake in tests
  cy.server();
  cy.route('/rest/regions**').as('restCall');

  // the fields have to be typed slowly to replicate ux and avoid the 'type slowly' error
  cy.log('destination mainion');
  mainPage.destination().type(destination, {delay: 60}).type('{enter}');
  cy.wait('@restCall');

  cy.log('reward mainion');
  mainPage.rewardProgram().type(rewardProgram).type('{downarrow}{enter}');

  cy.log('guest mainion');
  mainPage.guests().click();
  mainPage.guestDropdown().should('be.visible');
  mainPage.n_guests(numGuests).click();

  cy.log('room mainion');
  mainPage.rooms().click();
  mainPage.roomDropdown().should('be.visible');
  mainPage.n_rooms(numRooms).click();
  
  // date begin
  // date end

}


Cypress.Commands.add('uiLogin', uiLogin);
Cypress.Commands.add('fillSearchForm', fillSearchForm);
