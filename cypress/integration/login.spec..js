/// <reference types="Cypress" />

context('Login tests', () => {
  before(() => {
    cy.visit('/')
  })

  it('should login', function () {
    cy.log('hello I am here');
  })
})
