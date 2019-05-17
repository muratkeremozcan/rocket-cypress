// login form
export const signUpDialog = () => cy.get('.modal-body');
export const emailField = () => cy.get('.row > :nth-child(1) > .form-control');
export const signUpBtn = () => cy.get('.row > :nth-child(2) > .form-control');
export const consentCookies = () => cy.get(':nth-child(2) > .btn');

// search form
export const destination = () => cy.get('.tt-input');
export const rewardProgram = () => cy.get('.program-autosuggest-container > .rm-input-base');
export const dateStart = () => cy.get('#dp1558075576167');
export const dateEnd = () => cy.get('#dp1558075576168');
export const guests = () => cy.get('.adults');
export const guestDropdown = () => cy.get('.adults > .rm-select-base > .btn-group > .dropdown-menu');
export const n_guests = numGuests => cy.get(`.adults > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numGuests}) > a`);
export const rooms = () => cy.get('.rooms');
export const roomDropdown = () => cy.get('.rooms > .rm-select-base > .btn-group > .dropdown-menu');
export const n_rooms = numRooms => cy.get(`.rooms > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numRooms}) > a`);