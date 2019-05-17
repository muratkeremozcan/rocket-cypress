// ideally we want to create an attribute specific to cypress for any selector we use
  // this will be a tremendous help as the application changes -> from tech stack to minor face lift
  // https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

// login form
export const signUpDialog = () => cy.get('.modal-body');
export const emailField = () => cy.get('.row > :nth-child(1) > .form-control');
export const signUpBtn = () => cy.get('.row > :nth-child(2) > .form-control');
export const consentCookies = () => cy.get(':nth-child(2) > .btn');

// search form
export const destination = () => cy.get('.tt-input');
export const rewardProgram = () => cy.get('.program-autosuggest-container > .rm-input-base');

export const checkInDate = () => cy.get('.checkin.booking-date');
export const checkOutDate = () => cy.get('.checkout.booking-date');
export const calendar = () => cy.get('.ui-datepicker');
export const calendarDay = () => cy.get('.checkout > .calendar-day');
export const calendarNext = () => cy.get('.ui-datepicker-next');

export const guests = () => cy.get('.adults');
export const guestDropdown = () => cy.get('.adults > .rm-select-base > .btn-group > .dropdown-menu');
export const n_guests = numGuests => cy.get(`.adults > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numGuests}) > a`);

export const rooms = () => cy.get('.rooms');
export const roomDropdown = () => cy.get('.rooms > .rm-select-base > .btn-group > .dropdown-menu');
export const n_rooms = numRooms => cy.get(`.rooms > .rm-select-base > .btn-group > .dropdown-menu > :nth-child(${numRooms}) > a`);

export const searchBtn = () => cy.get('.rm-btn-orange > .ng-scope');