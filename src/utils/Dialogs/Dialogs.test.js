const React = require('react');
const {shallow, configure} = require('enzyme');
const {DialogManager} = require('./DialogManager');
const {DialogContainer} = require('./DialogContainer');
const {PromisifiedDialog} = require('./PromisifiedDialog');
const {Dialog, DialogActions, Button} = require('@material-ui/core');
const Adapter = require('enzyme-adapter-react-16');

configure({adapter: new Adapter()});

const base_state = {
    open: false,
    text: '',
    handle_accept: null,
    handle_refuse: null,
};

describe('We should be able to instantiate the container and use it to display dialogs.', () => {

    test('Creating the container registers the dialog creation callback', () => {

        expect(DialogManager.dialog_creation_callback).toBe(null);

        const wrapper = shallow(<DialogContainer />);
        expect(DialogManager.dialog_creation_callback).not.toBe(null);
        expect(wrapper.state()).toEqual({
            open: false,
            text: '',
            handle_accept: null,
            handle_refuse: null,
        });

        /**
         * The dialog creation callback should be reset when the container is removed from the dom
         */
        wrapper.unmount();
        expect(DialogManager.dialog_creation_callback).toBe(null);
    });

    test("Calling the confirm manager's method renders a dialog", async () => {
        const wrapper = shallow(<DialogContainer />);

        /**
         * both container's state and dialog props should not be opened
         */
        expect(wrapper.state().open).toEqual(false);
        expect(wrapper.dive().props().open).toEqual(false);

        /**
         * we ignore the promise here, we just want the state to be correctly updated
         * we wait manually for the component to be rendered
         */
        DialogManager.confirm('test');
        await one_second();

        expect(wrapper.state().open).toEqual(true);
        expect(wrapper.state().text).toEqual('test');

        /**
         * Technically the prop should be equivalent to the passed state, but let's be sure anyway
         */
        expect(wrapper.dive().props().open).toEqual(true);
        wrapper.unmount();
    });

    test('We can resolve or reject the promise through the button clicks', () => {
        /**
         * TODO here I repeat the test for both accept and refusal of promise, there's assuredly a more elegant way of testing for promise rejection or resolution
         */
        const wrapper = shallow(<DialogContainer />);
        let promise;
        let buttons;

        promise = DialogManager.confirm('test accept');
        promise.then(() => {
            expect(true).toBe(true);
        });
        buttons = wrapper.find(PromisifiedDialog).dive().find(Dialog).dive().find(DialogActions).dive().find(Button);
        expect(buttons).toHaveLength(2);
        buttons.first().simulate('click');

        /**
         * We resolved the promise with the confirmation button. the dialog should be closed and the state reset
         */
        expect(wrapper.state()).toEqual(base_state);

        promise = DialogManager.confirm('test reject');
        promise.then(
            null,
            () => {
                expect(true).toBe(true);
            }
        );
        buttons = wrapper.find(PromisifiedDialog).dive().find(Dialog).dive().find(DialogActions).dive().find(Button);
        expect(buttons).toHaveLength(2);
        buttons.first().simulate('click');

        /**
         * We resolved the promise with the confirmation button. the dialog should be closed and the state reset
         */
        expect(wrapper.state()).toEqual(base_state);

        wrapper.unmount();
    });

    test("We can't render multiple containers", () => {
        const wrapper = shallow(<DialogContainer />);
        expect(() => {
            const second_wrapper = shallow(<DialogContainer />);
            second_wrapper.unmount();
        }).toThrow();
        wrapper.unmount();
    });

    test('Calling the confirm method without container correctly throws', () => {
        expect(() => {
            DialogManager.confirm('test throw because no container');
        }).toThrow();

        DialogManager.register_dialog_creation_callback('invalid function');

        expect(() => {
            DialogManager.confirm('test throw because invalid callback');
        }).toThrow();
    });

});

const one_second = () => new Promise(resolve => setTimeout(resolve, 1000));