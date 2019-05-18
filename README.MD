# [Rocketmiles](https://www.rocketmiles.com/) web application [Cypress](https://www.cypress.io/) exercise

This repository includes:

* [Test Plan](test-plan.md)
* [Test: UI login with fake account](./cypress/integration/landing-bst.spec..js)
* [Test: Search functionality ](./cypress/integration/search-spec.js)
* [**Pipeline** with Circle CI](https://circleci.com/gh/muratkeremozcan/rocket-cypress)
* [**Parallel CI test execution** & test results on Cypress Dashboard](https://dashboard.cypress.io/#/projects/khn1sp/runs)
* [**Visual AI** tests with Percy.io in the CI](https://percy.io/Murat-Ozcan/rocket)
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
npx cypress open
```
Execute tests headlessly:
```bash
npx cypress run
```


## **Pipeline and Dashboard**

The project is setup to execute tests on [CircleCI](https://circleci.com/gh/muratkeremozcan/rocket-cypress) and record results at [Cypress Dashboard](https://dashboard.cypress.io/#/projects/khn1sp/runs) **where all CI results can be observed**.

The dashboard provides ability to scrutinize every build, see screenshots in case of failures and see **video recordings** of the tests: [example test run](https://dashboard.cypress.io/#/projects/khn1sp/runs/10/specs).

The pipeline is setup to run multiple CI machines. Each test spec will run in its own CI Debian instance.

## **Visual AI tests with Percy.io**

The tests execute in pipeline environment and get recorded at [public dashboard for the repository](https://percy.io/Murat-Ozcan/rocket/builds/1897358) . 

Chrome, Firefox at viewports 375px & 1280px are covered.

To trigger the visual AI tests, you can push to the repository. If there are no deltas in snapshots, the tests will pass automatically. If there are deltas, tests will need approval before passing. Failing state will be indicated at Percy dashboard or Github pull request.

To run locally you must first record the percy token in your environment variables (Mac, Linux, Windows), then run this command:

```bash
npx percy exec -- cypress run
```
<details> 
<summary>token</summary>
This is an open source project for educational purposes. We trust all parties to consume this information responsibily.

PERCY_TOKEN=476e0a4f9f667a3d7ae217168d84e39a353eb3e8dbcc02c03ecdf4d1ddaaecbb
</details>


____________

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
