
import { internet } from 'faker';



/* 
login: ideally you want to use a facebook test user to login to this application, 
but facebook test users are app-specific and need to be created by the dev of the application
https://www.facebook.com/whitehat/accounts/ 
also you want to login ONLY once using the UI in an isolated test get 100% confider UI login works
use api login for any other test: do not repeat the UI login through tests
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

Cypress.Commands.add('uiLogin', uiLogin);
