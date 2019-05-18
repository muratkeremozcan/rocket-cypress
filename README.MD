# [Rocketmiles](https://www.rocketmiles.com/) web application [Cypress](https://www.cypress.io/) exercise

This repository includes:

* [Test Plan](test-plan.md)
* [Test: UI login with fake account](./cypress/integration/landing-bst.spec..js)
* [Test: Search functionality ](./cypress/integration/search-spec.js)
* [Pipeline with Circle CI](https://circleci.com/gh/muratkeremozcan/rocket-cypress)
* [Parallel CI test execution and test results on Cypress Dashboard](https://dashboard.cypress.io/#/projects/khn1sp/runs)
* [Facebook api tests](./fb-api/bst.spec.js)

## **Getting started**
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
npm run cypress:run-local
```

## **Pipeline and Dashboard**

The project is setup to execute tests on CircleCI and record results at Cypress Dashboard.

The builds can be examined at public [CircleCI link](https://circleci.com/gh/muratkeremozcan/rocket-cypress) .

The test results (also builds) can be observed at public [Cypress Dashboard](https://dashboard.cypress.io/#/projects/khn1sp/runs).

The dashboard provides ability to scrutinize every build, see screenshots in case of failures and see **video recordings** of the tests: [example test run](https://dashboard.cypress.io/#/projects/khn1sp/runs/4/specs).

The pipeline is setup to run multiple CI machines. Each test spec will run in its own CI Debian instance.

## Additional notes
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

> Every test needs to be able to execute and fail in isolation. To test this you can put a `.only()` after any `describe`, `context` or `it` block and run the section by itself. You can also utilize `.skip()` to skip certain blocks.



## FB api tests
Go to Graph API Explorer at https://developers.facebook.com/tools/explorer.
* Go to My Apps.
* Click "+ Add a New App".
* Setup a website app. 
* Create a test application and get an access token for it
* Copy the token to the `token` constant in the [spec]((./fb-api/bst.spec.js))

Navigate to fb-api directory and execute with node.
```bash
cd fb-api
node bst.spec.js
```
Alternatively, you can use Quokka vsCode extension. Keyboard shortcut `ctrl+P >` then type Quokka start.
