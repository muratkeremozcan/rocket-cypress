# [Rocketmiles](https://www.rocketmiles.com/) web application [Cypress](https://www.cypress.io/) exercise

This repository includes:

* [Test Plan](test-plan.md)
* [Test: UI login with fake account](./cypress/integration/landing-smoke.spec.js)
* [Test: e2e Search workflow](./cypress/integration/search.spec.js)
* [Test: back to back Search](./cypress/integration/search-twice.spec.js)
* [**Pipeline** with Circle CI](https://circleci.com/gh/muratkeremozcan/rocket-cypress)
* [**Parallel CI test execution** & test results on Cypress Dashboard](https://dashboard.cypress.io/#/projects/khn1sp/runs)
* [**Visual AI** tests with Percy.io in the CI](https://percy.io/Murat-Ozcan/rocket)
* [Facebook api tests](./fb-api/bst.spec.js)

## **Getting started**
Update to the latest stable or *current* version of NodeJs.
* [Linux](https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version):
  ```bash
  sudo npm cache clean -f
  sudo npm install -g n
  sudo n latest
  ```
* [Mac](https://solarianprogrammer.com/2016/04/29/how-to-upgrade-nodejs-mac-os-x/)
* [Windows](https://github.com/felixrieseberg/npm-windows-upgrade)

Clone the repository and npm install:
```bash
git clone https://github.com/muratkeremozcan/rocket-cypress.git
cd rocket-cypress
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

The pipeline is setup to run 3 CI machines in **parallel**. Each test spec will run in its own CI Debian instance.

## **Visual AI tests with Percy.io**

The tests execute in the pipeline environment and get recorded at [public dashboard for the repository](https://percy.io/Murat-Ozcan/rocket).

Chrome, Firefox at viewports 375px & 1280px are covered.

To trigger the visual AI tests, you can push to the repository. If there are no deltas in snapshots, the tests will pass automatically. If there are deltas, tests will need approval before passing. Failing state will be indicated at Percy dashboard or Github pull request.


<details> 
<summary>Running locally</summary>
This is an open source project for educational purposes. We trust all parties to consume this information responsibly.

To run locally you must first record the percy token in your environment variables:
* [Linux](https://askubuntu.com/questions/58814/how-do-i-add-environment-variables/58828#58828)
* [Mac](https://www.google.com/search?ei=kYriXN6lIczAsAWMhYOwDg&q=environment+variables+mac&oq=environment+variables+mac&gs_l=psy-ab.3..0i20i263l2j0j0i30l7.390633.391578..391707...0.0..0.66.227.4....1..0....1..gws-wiz.......0i71j35i39j0i67.0alC1orOG68#kpvalbx=1) 
* [Windows](https://www.computerhope.com/issues/ch000549.htm) 

In most systems, you need to reboot before the environment variable is recorded.

> Warning: The following is only verified in Windows and pipeline. `percy exec` experience may vary in Mac or Linux.

Run this command:

```bash
npx percy exec -- cypress run
```
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
