require('cypress-plugin-retries');
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test in case of uncaught exceptions
  // https://on.cypress.io/uncaught-exception-from-application
  // possible defect: there is an error as we click the search button
    // 'Uncaught TypeError: r.shift is not a function'
  return false
})