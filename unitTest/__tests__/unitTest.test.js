import { createElement } from 'lwc';
//import the component that we're testing
import UnitTest from 'c/unitTest';

//starts the jest test suite
//describe accepts two arguments -> 
    //1) description of the unit we're testing, usually in the form of a noun
    //2) callback function that holds 1 or more tests
describe('c-unit-test', () => {
    //cleanup - afterEach runs after each test in the describe block
    afterEach(() => {
        //jest uses jsdom to provide an environment like a browser's dom
        //each test file shares a single instance of jsdom
        //changes aren't reset in between tests so use afterEach to reset the dom
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    //it block describes a single test
    //it accepts two arguments ->
        //1) description of what we're expecting (usually starts with a verb)
        //2) callback that builds the test & holds assertions
    it('displays unit status with default unitNumber', () => {
        //create an instance of the cmp and assign it to 'element'
        const element = createElement('c-unit-test', {
            is: UnitTest
        });

        //assertion that default unitNumber = 5
        expect(element.unitNumber).toBe(5);

        //attaches the element to the jsdom instance and renders it
        //connectedCallback() & renderedCallback() are called
        document.body.appendChild(element);

        //search the dom for the appended element
        //use element.shadowRoot as the parent for the query
        //element.shadowroot is a test-only API that allows you to inspect a cmp's shadow tree
        const div = element.shadowRoot.querySelector('div');
        
        //verify displayed greeting
        expect(div.textContent).toBe('Unit 5 alive!');
    });

    //test asynchronous DOM updates
    //when the state of a lwc changes, the dom updates asynchronously
    //to ensure that your test waits for updates before evaluating, use promises
    it('displays unit status with updated unitNumber', () => {
        //recreate the instance of the cmp and attach it to the jsdom 
        //since afterEach wipes the dom after each individual test (aka it block)
        const element = createElement('c-unit-test', {
            is: UnitTest
        });
        document.body.appendChild(element);
        
        //update unitNumber after element is appended
        element.unitNumber = 6
        const div = element.shadowRoot.querySelector('div');
        //unitNumber should NOT equal 6 right now since we haven't waited for the change yet
        expect(div.textContent).not.toBe('Unit 6 alive!');

        //return a promise to wait for any async dom updates
        //jest will automatically wait for the promise chain to complete
        //before ending the test and failing if the promise is rejected
        return Promise.resolve().then(() => {
            expect(div.textContent).toBe('Unit 6 alive!');
        })
    });

    //test when an input field updates, the unit status gets updated
    //use a change event in the input field
    it('displays unit status with input change event', () => {
        const element = createElement('c-unit-test', {
            is: UnitTest
        });

        document.body.appendChild(element);
        const div = element.shadowRoot.querySelector('div');

        //trigger unit status input change
        const inputElement = element.shadowRoot.querySelector('lightning-input');
        inputElement.value = 7;
        
        //simulate an event with a CustomEvent of type 'change'
        inputElement.dispatchEvent(new CustomEvent('change'));
        return Promise.resolve().then(() => {
            expect(div.textContent).toBe('Unit 7 alive!');
        });
    });
});