# [Rocketmiles](https://www.rocketmiles.com/) web application [Cypress](https://www.cypress.io/) exercise

This exercise includes:

* UI login with fake account
* Search functionality tests
* Test Plan
* Facebook api tests

## Getting started:
Clone the repository and npm install:
```bash
git clone https://github.com/muratkeremozcan/rocket-cypress.git
cd rocket-exercise
npm i
```
Start Cypress:
```bash
npm run cypress:open
```
Execute tests headlessly:
```bash
npm run cypress:run
```
Using headless execution, you can execute consistency tests on the specs to ensure flake-freeness.

Wrap the top `describe()` block in `Cypress._.times(<numRepeats>, () => { ... }` and execute headlessly.

```javascript
Cypress._.times(100, () => {
  describe('...', () => { 
    ... 
  });
});
```
> You can also execute in headed mode using `npm run cypress:open` but due to the amount of tests Cypress runner may crash in that scenario.

> Every test needs to be able to execute and fail in isolation. To test this you can put a .only() on any describe, context or it block and run the section by itself. You can also utilize .skip().

## FB api tests
Navigate to fb-api directory and execute with node.
```bash
cd fb-api
node bst.spec.js
```
Alternatively, you can use QuokkaJS vsCode extension. Keyboard shortcut `ctrl+P >` then type Quokka start.