## **Test Plan**

### **Goals and responsibilities of testing**

The purpose of testing is to provide information about the system under test (SUT) which can add value.

Responsibilities include:

* Verification & validation
* Defects & diagnosis
* Risk reduction
* Issue prevention & speed up development
* Coverage

Coverage in this context will be defined as a *measurement of completeness and thoroughness based on a test model*.

There can be various categories of coverage per the test model:
* Unit
* Requirement
* Workflow / Scenario
* Non-functional requirement (NFR) which may include highest priority quality attributes for the system, such as:
  * Performance & Scalability
  * Security
  * Reliability
* Model based (recall model based testing)
* Combinatorial coverage (data driven)

### **Test items, SUT**

Assumptions made about the architecture:
* AngularJs front-end
* Node.js and Express
* Java back-end
* Microservice architecture, hosted on AWS

### <a name="rbt"> **Risks based testing** </a> 

No module is immune to improvement, and not everything can be tested.

Risk will be evaluated with 3 parameters on a case by case basis:
* Probability of failure
* Impact of failure
* Effectiveness of re-test in case of failure. 
  > If effectiveness of re-test is high, risk is low.

Instances where the value added by testing and risk is low will be treated as low priority for test. 

### **Features to be tested**

The most effective way to describe a requirement is to specify how you would test it.

Use of BDD patterns will be encouraged in requirement specification. Test lead/expert/architect will take part in all requirement elicitation activities.

It is encouraged to take advantage of BDD patterns in tools & frameworks that support it. Examples include Jasmine, Karma and Mocha.

Refer to [Risk Based Testing](#rbt) for constraints and contingencies.

### **Non-functional requirements**
Test lead/expert/architect will collaborate with system architect and product owners in requirement elicitation activities.

Most significant Quality Attributes for the SUT will be identified. Examples include performance, scalability, reliability, security.

A Utility Tree will be created:
  * Specific facets of the Quality Attribute will be detailed.
  * For each facet, the priority and risk (high, medium, low) will be identified.
  * Measurable scenarios for each facet will be identified

To eliminate ambiguity and misinterpretation, these measurable scenarios will be detailed in Scenario Description Templates which will be in the format of:

**Source of Stimulus** -> **Stimulus** -> **the Artifact and its Environment** -> **Response** -> **Response measure**

## **Test Strategy and approach**

### Test levels

A reference to the V model:

Business requirements ----------> Acceptance & Field testing

System requirements   ------------> System Testing

Architectural requirements ------> Contract & Integration testing

Unit     ------------------------> Static ode analysis, Unit, Component, and Mutation testing

The test effort will prioritize on architectural level and above with a focus on integration and e2e-ui tests. The contract, unit and static code analysis below will be development responsibility.

As a stretch goal, testing will get involved in Mutation Analysis of the unit tests. If mutation scores are underwhelming for important components, added unit tests will be encouraged. Testing can take part in this effort as a stretch goal.

### **Test techniques**
There is an arsenal of test techniques that can be utilized to provide information about the system and add value.
These are some of the test techniques suitable to apply on the SUT:

* Black-box: requirement based, workflow, state-based, combinatorial, eq. class and boundary value.
* Gray-box: interfaces between components, services, systems
* White-box: (dev) statement, branch, path
* Fault-based: exploratory, fuzzing, mutation
* Regression: risk based testing and testing firewall

## **Manual testing**

Testing expects reliable behavior from the SUT; controllable -> internally reliable -> consistently observable.

Due to the nature of the SUT, the observability of consistent results may not always be possible. Utilize visual-AI tests where it can address this problem. For cases visual-UI cannot add value, manual testing will be utilized.

[Systematic Exploratory Testing](https://www.developsense.com/resources.html#exploratory) will be encouraged for all test activities.

Manual testing will be preferred over unreliable automation due to the SUT nature, or automation that costs more in maintenance than value-add in fault-detection.

## **Test automation**
End to end test automation engineering and test script management:
* Use test techniques as guidelines to ensure quality.
* Functional quality attributes of the test code:
  * Correctness in properly validating the SUT
  * Effectiveness in fault detection
  * Mimimal maintanence required: tests should be less likely to fail on every granular development change.
    > This is an elegant balance between the test being detailed enough to find faults and not being so detailed that they will require additional maintenance.
    > Exploratory testing will fill the gap for any detail left out in automated test for the sake of lowering test upkeep.
* Non functional quality attributes of the test code:
  * Maintainable, understandable, readable
  * Test redundancy should be minimized, but should be considered for cases where it will increase modularity and reduce diagnosis time. When a defect occurs, ideally it should fail a minimal amount of tests because the tests should be as modular as they can. 

### **Test States** 

**Repeatability**: tests must setup state, perform the test and leave the environment in a clean state which does not effect the execution of the next test. If a test clutters the system in every execution, this is manual test candidate. Tests must also not clash with each other: multiple testers, pipelines must be able to execute the same test at the same time. If this is not possible, these group of tests should be executed once a day, preferably outside of business hours.

Each test that must change the state of the environment has to be used as a setup-state-test and must make possible for the test environment to be able to be cleaned up for the next test.

UI tests should not repeat themselves as setup tests; API test should be utilized wherever a UI test has to be used as a setup for another test.

**Before all vs after all**: before all preferred; wherever possible, the test itself should take responsibility that it starts in a clean environment. However, as emphasized above, tests must not make it so that after their execution the next test cannot clean up the enviroment.

**Test state setup**: It is encouraged that tests are isolated so that they do not rely on an entire setup before they can be executed. Example: if a group of tests may need a user to be created, a test user can be utilized to use these tests in isolation. An the other hand, the tests that setup the user should be independent and isolated in themselves.

**Login**: Varieties of UI-login should only be used in their singular test cases. Any other tests that requires login should use intrinsic API login and/or have a pre-configured test user.

**Modularity**: each test should be able to be run by itself, not relying on other tests to setup state for it. If this setup is required, it should be handled in beforeAll or beforeEach sections. A good way to test this is to run the test in isolation: `it.only()` , `fit()`, etc.).
  
    
### **Test flake**
Tests must produce consistent results every time. Pipeline execution is the quorum.
  
If a test cannot produce reliable results, it reduces confidence in the tests and requires maintenance which reduces all value. In these cases it is best to manual test.

**Locally identifying test flake**: headless execution in an OS that replicates pipeline CI machine is preferred; Linux & Mac will behave more similar to the pipeline than Windows -with the exception of windows docker containers if you are using one. Headless execution will reveal more of the test flake. There are various ways to repeatedly execute a test spec, one example from cypress is using the lodash library  `Cypress._.times( <times to repeat>, () => { <your test spec code> })`. This must be utilized before pushing any code for a merge request.

**Identifiying test flake in the pipeline**: use consistency testing; if pipeline runners allow it, run as many test specs in parallel in a pipeline job, and then repeat the stage. Example: 5 pipelines in parallel for a job, the stage repeats 5 times, resulting in 25 executions of the test spec.

Some frameworks also have access to the API layer. When doing ui-e2e testing, sniff the API and wait for calls to happen before making UI assertions. It is best to have full assertion API tests separated to build confidence that the APIs work before running the UI tests that rely on them. This is so that UI tests can be isolated to UI failures when the APIs are working well. It is preferable not to do only-UI testing without any awareness of the APIs.

**Test retry**: Many frameworks have a retry mechanism. These should be utilized as a last resort if the test is still very valuable to have despite flakiness that cannot be worked around. It is acceptable to use retry mechanism if the inconsistent test result is due to a -hopefully temporary- unreliability in the system. In these cases, defects should be entered against the system for the sporadic issues, and work around them in automated testing with retry mechanism. Retry can also be implemented at test code level using recursion, be sure to use counters and only retry a limited number of times.

### **CI: branch, master, preview | prod**

Every project will be different in its needs; a hardware project may not benefit from stubbed fixtures, however many do.

Branch: ensure to be able to run against **localhost** in the branch execution. Consider using stubbed fixtures for external components, if this does not drive up maintenance cost of these stubs. Example: the response an API gives may be changing too much and the fixtures need to be updated. This is best handled in the initial stages of a project.

Master: ensure to run against DEV, INT - depending on the project there may be multiple levels. These tests are encouraged to be testing the system end to end, depending on the SUT.

Preview & Prod: you can automate in these stages by running a subset or full suite of tests. This depends on the needs of the SUT. Pay attention to states that have to be setup, users that have to created and ensure that the test execution does not impact analytics.

Collaborate strongly with the devOps team in all pipeline automation activities to ensure performant and lean test execution.
Utilize parallel pipelines and load balancing to speed up tests. Some frameworks offer this as a service, at minimal you can specify what specs should be run in which CI machine and execute in parallel to reduce pipeline execution time.

### **Test data, deliverables and documentation**
All test data and deliverables will be stored in the repository and the pipeline execution results.

Documentation of test designs, test processes can be in its own repository.

## **Test exit criteria**
Test exit criteria relies on 3 parameters:
* Defects : depending on the project, it may not be ok to ship with major defects
* Test execution: has the needed tests been created and executed
* Coverage: depending on the test model you are evaluating completeness and thoroughness, is coverage satisfactory? Example have all the requirements been covered. 

### **Frameworks, tools**
Consider using the latest tech that can be good fit for the projects. Tools and frameworks completely rely on the needs of the team and the SUT; use what works best and keep evaluating the tech scene for things that can work better.

Some of the modern web development test frameworks & tools include: Cypress, Protractor, Puppeteer, Jasmine, Karma, Mocha, Chai, Sinon, WallabyJs, Stryker (mutation), K6-loadImpact (performance), Sn1per (pentest).