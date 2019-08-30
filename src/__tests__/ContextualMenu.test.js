// @flow strict

import {ContextualMenuManager} from "../components/ContextualMenu/ContextualMenuManager";
import {ContextualMenuContainer, default_state} from "../components/ContextualMenu/ContextualMenuContainer";
import {MenuItem} from '@material-ui/core';

const React = require('react');
const {shallow, mount, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const {wait} = require('./utils');
const {JSDOM} = require('jsdom');
const {window} = new JSDOM(`<!doctype html><body><div id="contextual-menu-root"></div></body>`);

function copyProps(src, target) {
    Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
    });
}

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};
copyProps(window, global);

configure({adapter: new Adapter()});

const default_options = [
    {'text': 'option 1 text', value: 'option_1_value'},
    {'text': 'option 2 text', value: 'option_2_value'},
];

describe('We should be able to instantiate the contextual menu container and use it to display options.', () => {

    test('Creating the container registers the populate menu callback', () => {

        expect(ContextualMenuManager.populate_menu_callback).toBe(null);

        const wrapper = shallow(<ContextualMenuContainer />);
        expect(ContextualMenuManager.populate_menu_callback).not.toBe(null);
        expect(wrapper.state()).toEqual(default_state);

        /**
         * The dialog creation callback should be reset when the container is removed from the dom
         */
        wrapper.unmount();
        expect(ContextualMenuManager.populate_menu_callback).toBe(null);
    });

    test("Calling the choose_option manager's method renders a dialog", async () => {
        const wrapper = shallow(<ContextualMenuContainer />);
        /**
         * we ignore the promise here, we just want the state to be correctly updated
         * we wait manually for the component to be rendered
         */
        ContextualMenuManager.choose_option(default_options);
        await wait(1000);

        expect(wrapper.state().menu_items[0].text).toEqual('option 1 text');

        wrapper.unmount();
    });

    test('Calling the confirm method without container correctly throws', async () => {
        await expect(ContextualMenuManager.choose_option(default_options)).rejects.toEqual('There is no populate menu callback registered. Did you instantiate a ContextualMenuContainer?');

        expect(() => {
            /**
             * $FlowFixMe
             * here we want to specifically test calling the function with an invalid type
             */
            ContextualMenuManager.register_populate_menu_callback('invalid function');
        }).toThrow('The populate menu callback should be a function.');

        /**
         * $FlowFixMe
         * here we want to specifically test what happens if someone directly assigns to the property
         */
        ContextualMenuManager.populate_menu_callback = 'invalid function';
        await expect(ContextualMenuManager.choose_option(default_options)).rejects.toEqual('The populate menu callback registered is not a function. ' +
            'Did you instantiate a ContextualMenuContainer?');
        ContextualMenuManager.populate_menu_callback = null;
    });

    test('We can choose a specific option from the contextual menu', async (done) => {
        const wrapper = mount(<ContextualMenuContainer />);
        const promise = ContextualMenuManager.choose_option(default_options);
        promise.then(value => {
            expect(value).toBe('option_1_value');
            wrapper.unmount();
            done();
        });
        await wait(0);
        wrapper.update();
        const options = wrapper.find(MenuItem);
        expect(options.length).toBe(2);
        options.first().simulate('click');
    });

    test('We enforce to have more than a single option when choosing options', async () => {
        const wrapper = mount(<ContextualMenuContainer />);
        await expect(ContextualMenuManager.choose_option([
            {'text': 'option 1 text', value: 'option_1_value'},
        ])).rejects.toEqual('You should ask for at least two options for the user to choose from.');
        wrapper.unmount();
    });

    test("We can't render multiple contextual menu containers", () => {
        const wrapper = shallow(<ContextualMenuContainer />);
        expect(() => {
            const second_wrapper = shallow(<ContextualMenuContainer />);
            second_wrapper.unmount();
        }).toThrow();
        wrapper.unmount();
    });

});
